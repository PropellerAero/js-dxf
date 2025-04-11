const Drawing = require("../src/Drawing");
const LineType = require("../src/LineType");
const Layer = require("../src/Layer");

describe("Drawing", function () {
    const fs = require("fs");

    if (!fs.existsSync("output")) {
        fs.mkdirSync("output");
    }

    it("can be just blank", async function () {
        var d = new Drawing();
        fs.writeFileSync("output/blank.dxf", await d.toDxfString());
    });

    it("can add a line type", async function () {
        var d = new Drawing();
        d.addLineType("MyDashed", "_ _ _ _ _ _", [0.25, -0.25]);
        d.addLineType("MyCont", "___________", []);
        expect(d.lineTypes["MyCont"]).toEqual(jasmine.any(LineType));
        fs.writeFileSync("output/add_line_type.dxf", await d.toDxfString());
    });

    it("can add a layer", async function () {
        var d = new Drawing();
        d.addLineType("MyDashed", "_ _ _ _ _ _", [0.25, -0.25]);
        d.addLineType("MyCont", "___________", []);
        d.addLayer("MyLayer", Drawing.ACI.GREEN, "MyDashed");
        expect(d.layers["MyLayer"]).toEqual(jasmine.any(Layer));
        fs.writeFileSync("output/add_layer.dxf", await d.toDxfString());
    });

    it("can add a layer with a bad name", function () {
        var d = new Drawing();
        d.addLineType("MyDashed", "_ _ _ _ _ _", [0.25, -0.25]);
        d.addLineType("MyCont", "___________", []);
        expect(() =>
            d.addLayer("/!@<>", Drawing.ACI.GREEN, "MyDashed")
        ).toThrowError();
    });

    it("can draw a line", async function () {
        var d = new Drawing();
        d.drawLine(0, 0, 100, 100);
        fs.writeFileSync("output/line_0_0_100_100.dxf", await d.toDxfString());
    });

    it("can draw a point", async function () {
        var d = new Drawing();
        d.drawPoint(50, 50, 50);
        fs.writeFileSync("output/point.dxf", await d.toDxfString());
    });

    it("can draw a mesh", async function () {
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
        fs.writeFileSync("output/mesh-simple.dxf", await d.toDxfString());
    });

    it("can draw a mesh to stream", async function () {
        const stream = new fs.createWriteStream(
            "output/mesh-simple-stream.dxf"
        );

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
    });
});
