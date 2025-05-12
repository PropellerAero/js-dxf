const fs = require("fs");
const os = require("os");
const path = require("path");

const Drawing = require("../src/Drawing");
const LineType = require("../src/LineType");
const Layer = require("../src/Layer");
const Handle = require("../src/Handle");

describe("Drawing", function () {
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

  it("can be just blank", function () {
    const { fixtureFilepath } = setup("blank.dxf");
    const d = new Drawing();

    expect(d.toDxfString()).toEqual(getFile(fixtureFilepath));
  });

  it("can add a line type", function () {
    const { fixtureFilepath } = setup("add_line_type.dxf");
    const d = new Drawing();

    d.addLineType("MyDashed", "_ _ _ _ _ _", [0.25, -0.25]);
    d.addLineType("MyCont", "___________", []);

    expect(d.lineTypes["MyCont"]).toEqual(jasmine.any(LineType));
    expect(d.toDxfString()).toEqual(getFile(fixtureFilepath));
  });

  it("can add a layer", function () {
    const { fixtureFilepath } = setup("add_layer.dxf");
    const d = new Drawing();

    d.addLineType("MyDashed", "_ _ _ _ _ _", [0.25, -0.25]);
    d.addLineType("MyCont", "___________", []);
    d.addLayer("MyLayer", Drawing.ACI.GREEN, "MyDashed");

    expect(d.layers["MyLayer"]).toEqual(jasmine.any(Layer));
    expect(d.toDxfString()).toEqual(getFile(fixtureFilepath));
  });

  it("cannot add a layer with a bad name", function () {
    const d = new Drawing();
    d.addLineType("MyDashed", "_ _ _ _ _ _", [0.25, -0.25]);
    d.addLineType("MyCont", "___________", []);
    expect(() =>
      d.addLayer("/!@<>", Drawing.ACI.GREEN, "MyDashed")
    ).toThrowError();
  });

  it("can draw a line", function () {
    const { fixtureFilepath } = setup("line_0_0_100_100.dxf");
    const d = new Drawing();

    d.drawLine(0, 0, 100, 100);

    expect(d.toDxfString()).toEqual(getFile(fixtureFilepath));
  });

  it("can draw a point", function () {
    const { fixtureFilepath } = setup("point.dxf");
    const d = new Drawing();

    d.drawPoint(50, 50, 50);

    expect(d.toDxfString()).toEqual(getFile(fixtureFilepath));
  });

  it("can draw a mesh", function () {
    const { fixtureFilepath } = setup("mesh-simple.dxf");

    const d = new Drawing();

    d.drawMesh(
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

    expect(d.toDxfString()).toEqual(getFile(fixtureFilepath));
  });
});

function getFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function setup(filename) {
  const fixtureFilepath = path.join(__dirname, 'fixtures', filename);
  const exampleFilepath = path.join(__dirname, '..', 'examples', filename);
  return { fixtureFilepath, exampleFilepath };
}