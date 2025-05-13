const fs = require("fs");
const os = require("os");
const path = require("path");

const StreamableDrawing = require("../src/StreamableDrawing");
const Handle = require("../src/Handle");
const { getFile, getExampleFileFixtures } = require("./support/helpers");

describe("StreamableDrawing", function () {
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
      const d = new StreamableDrawing(outputFilepath);
      const { asyncDraw } = require(exampleFilepath.replace(".dxf", ""));

      await asyncDraw(d);

      await d.end();

      expect(getFile(outputFilepath)).toEqual(getFile(exampleFilepath));
    });
  });

  it("can draw a mesh to stream", async function () {
    const { outputFilepath, fixtureFilepath } = setup(outputDir, "mesh-simple-stream.dxf");
    var d = new StreamableDrawing(outputFilepath);

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

    expect(getFile(outputFilepath)).toEqual(getFile(fixtureFilepath));
  });
});

function setup(outputDir, filename) {
  const outputFilepath = path.join(outputDir, filename);
  const fixtureFilepath = path.join(__dirname, 'fixtures', filename);
  const exampleFilepath = path.join(__dirname, "..", "examples", filename);
  return { outputFilepath, fixtureFilepath, exampleFilepath };
}