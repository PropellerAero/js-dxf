const fs = require("fs");
const os = require("os");
const path = require("path");

const Drawing = require("../src/NodeJsDrawing");
const Handle = require("../src/Handle");
const { getFile, getExampleFileFixtures, parseHandles } = require("./support/helpers");
const { once } = require("../src/once");

describe("NodeJsDrawing", function () {
  let outputDir;

  beforeAll(() => {
    outputDir = path.join(os.tmpdir(), "output");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  });

  beforeEach(() => {
    Handle.reset();
  });

  getExampleFileFixtures().forEach((filename) => {
    it(`can draw ${filename}`, async function () {
      const { outputFilepath, exampleFilepath } = setup(outputDir, filename);
      const stream = fs.createWriteStream(outputFilepath);
      const d = new Drawing(stream);
      const { draw } = require(exampleFilepath.replace(".dxf", ""));

      await draw(d);

      await d.end();

      stream.end();

      await once(stream, "finish");

      expect(getFile(outputFilepath)).toEqual(getFile(exampleFilepath));
    });
  });

  it("keeps $HANDSEED above every handle when end() races in-flight draws", async function () {
    const { outputFilepath } = setup(outputDir, "handseed-race.dxf");
    const stream = fs.createWriteStream(outputFilepath);
    const d = new Drawing(stream);

    d.addLayer("surface", Drawing.ACI.YELLOW, "CONTINUOUS");
    d.setActiveLayer("surface");

    const points = Array.from({ length: 40 }, (_, i) => [i, i, 9.768]);

    // Simulates a caller bug: end() is invoked while draws are still in flight.
    // Late draws are allowed to fail once the drawing has ended; silent
    // handle corruption is what we guard against.
    const drawEverything = (async () => {
      for (let i = 0; i < 200; i++) {
        await d.drawPolyline3d(points);
      }
    })().catch(() => {});

    await d.end();
    await drawEverything;

    stream.end();
    await once(stream, "finish");

    const output = getFile(outputFilepath);
    const { handseed, maxHandle } = parseHandles(output);

    expect(handseed).not.toBeNull();
    expect(handseed).toBeGreaterThan(maxHandle);

    // No half-written entities: every POLYLINE must be terminated by a SEQEND.
    const lines = output.split("\n");
    const polylineCount = lines.filter((l) => l === "POLYLINE").length;
    const seqendCount = lines.filter((l) => l === "SEQEND").length;
    expect(polylineCount).toEqual(seqendCount);
  });

  it("can draw a mesh to stream", async function () {
    const { outputFilepath, fixtureFilepath } = setup(outputDir, "mesh-simple-stream.dxf");
    const stream = fs.createWriteStream(outputFilepath);
    var d = new Drawing(stream);

    await d.drawMesh(
      [
        [0, 0, 0],
        [100, 0, 0],
        [0, 100, 0],
        [100, 100, 0],
      ],
      [
        [0, 2, 3],
        [0, 3, 1],
      ]
    );

    await d.end();

    stream.end();

    await once(stream, "finish");

    expect(getFile(outputFilepath)).toEqual(getFile(fixtureFilepath));
  });
});

function setup(outputDir, filename) {
  const outputFilepath = path.join(outputDir, filename);
  const fixtureFilepath = path.join(__dirname, 'fixtures', filename);
  const exampleFilepath = path.join(__dirname, "..", "examples", filename);
  return { outputFilepath, fixtureFilepath, exampleFilepath };
}