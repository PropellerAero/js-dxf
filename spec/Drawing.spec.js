const fs = require("fs");
const path = require("path");

const Drawing = require("../src/Drawing");
const LineType = require("../src/LineType");
const Layer = require("../src/Layer");
const exp = require("constants");

describe("Drawing", function () {

  beforeAll(() => {
    if (!fs.existsSync("output")) {
      fs.mkdirSync("output");
    }
  });

  it("can be just blank", async function () {
    const { outputFilepath, fixtureFilepath } = setup("blank.dxf");
    const d = new Drawing();

    fs.writeFileSync(outputFilepath, await d.toDxfString());

    expect(
      compareFilesByHash(outputFilepath, fixtureFilepath)
    ).toBe(true);
  });

  it("can add a line type", async function () {
    const { outputFilepath, fixtureFilepath } = setup("add_line_type.dxf");
    const d = new Drawing();

    d.addLineType("MyDashed", "_ _ _ _ _ _", [0.25, -0.25]);
    d.addLineType("MyCont", "___________", []);

    expect(d.lineTypes["MyCont"]).toEqual(jasmine.any(LineType));

    fs.writeFileSync(outputFilepath, await d.toDxfString());

    expect(
      compareFilesByHash(outputFilepath, fixtureFilepath)
    ).toBe(true);
  });

  it("can add a layer", async function () {
    const { outputFilepath, fixtureFilepath } = setup("add_layer.dxf");
    var d = new Drawing();

    d.addLineType("MyDashed", "_ _ _ _ _ _", [0.25, -0.25]);
    d.addLineType("MyCont", "___________", []);
    d.addLayer("MyLayer", Drawing.ACI.GREEN, "MyDashed");

    expect(d.layers["MyLayer"]).toEqual(jasmine.any(Layer));

    fs.writeFileSync(outputFilepath, await d.toDxfString());

    expect(
      compareFilesByHash(outputFilepath, fixtureFilepath)
    ).toBe(true);
  });

  it("cannot add a layer with a bad name", function () {
    var d = new Drawing();
    d.addLineType("MyDashed", "_ _ _ _ _ _", [0.25, -0.25]);
    d.addLineType("MyCont", "___________", []);
    expect(() =>
      d.addLayer("/!@<>", Drawing.ACI.GREEN, "MyDashed")
    ).toThrowError();
  });

  it("can draw a line", async function () {
    const { outputFilepath, fixtureFilepath } = setup("line_0_0_100_100.dxf");
    var d = new Drawing();

    d.drawLine(0, 0, 100, 100);

    fs.writeFileSync(outputFilepath, await d.toDxfString());

    expect(
      compareFilesByHash(outputFilepath, fixtureFilepath)
    ).toBe(true);
  });

  it("can draw a point", async function () {
    const { outputFilepath, fixtureFilepath } = setup("point.dxf");
    var d = new Drawing();

    d.drawPoint(50, 50, 50);

    fs.writeFileSync(outputFilepath, await d.toDxfString());

    expect(
      compareFilesByHash(outputFilepath, fixtureFilepath)
    ).toBe(true);
  });

  it("can draw a mesh", async function () {
    const { outputFilepath, fixtureFilepath } = setup("mesh-simple.dxf");

    var d = new Drawing();

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

    fs.writeFileSync(outputFilepath, await d.toDxfString());

    expect(
      compareFilesByHash(outputFilepath, fixtureFilepath)
    ).toBe(true);
  });

  it("can draw a mesh to stream", async function () {
    const { outputFilepath, fixtureFilepath } = setup("mesh-simple-stream.dxf");
    const stream = new fs.createWriteStream(outputFilepath);

    var d = new Drawing();

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

    await d.writeDxfToStream(stream);
    stream.end();

    await new Promise((resolve) => {
      stream.on("finish", resolve);
    });

    expect(
      compareFilesByHash(outputFilepath, fixtureFilepath)
    ).toBe(true);
  });
});

function getFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function compareFilesByHash(filepath1, filepath2) {
  return getFile(filepath1) === getFile(filepath2);
}

function setup(filename) {
  const outputFilepath = `output/${filename}`;
  const fixtureFilepath = `spec/fixtures/${filename}`;
  return { outputFilepath, fixtureFilepath };
}