const fs = require("fs");
const os = require("os");
const path = require("path");

const StreamableDrawing = require("../src/StreamableDrawing");
const Handle = require("../src/Handle");
const { get } = require("http");

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

    expect(
      compareFiles(outputFilepath, fixtureFilepath)
    ).toBe(true);
  });
});

function getFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function compareFiles(filepath1, filepath2) {
  return getFile(filepath1) === getFile(filepath2);
}

function setup(outputDir, filename) {
  const outputFilepath = path.join(outputDir, filename);
  const fixtureFilepath = path.join(__dirname, 'fixtures', filename);
  return { outputFilepath, fixtureFilepath };
}