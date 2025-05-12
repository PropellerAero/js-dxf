const os = require('os');
const fs = require('fs');
const path = require('path');
const { once } = require('node:stream');

const AppId = require("./AppId");
const Arc = require("./Arc");
const Block = require("./Block");
const BlockRecord = require("./BlockRecord");
const Circle = require("./Circle");
const Cylinder = require("./Cylinder");
const Dictionary = require("./Dictionary");
const DimStyleTable = require("./DimStyleTable");
const Drawing = require('./Drawing');
const Ellipse = require("./Ellipse");
const Face = require("./Face");
const Handle = require('./Handle');
const Layer = require("./Layer");
const Line = require("./Line");
const Line3d = require("./Line3d");
const LineType = require("./LineType");
const Mesh = require("./Mesh");
const Point = require('./Point');
const Polyline = require('./Polyline');
const Polyline3d = require("./Polyline3d");
const Spline = require("./Spline");
const Table = require("./Table");
const TagsManagerWithStream = require("./TagsManagerWithStream");
const Text = require('./Text');
const TextStyle = require("./TextStyle");
const Viewport = require("./Viewport");
const Vertex = require('./Vertex');

class StreamableDrawing {
  constructor(filepath) {
    this._layers = {};
    this._activeLayer = null;
    this._lineTypes = {};
    this._headers = {};
    this._tables = {};
    this._blocks = {};
    this._dictionary = new Dictionary();
    this._filepath = filepath;
    this._tempDir = this._makeTempDir();
    this._tempShapes = this._createTemporaryTagsManager("temporary_shapes.dxf");

    this.setUnits("Unitless");

    for (const ltype of Drawing.LINE_TYPES) {
      this.addLineType(ltype.name, ltype.description, ltype.elements);
    }

    for (const l of Drawing.LAYERS) {
      this.addLayer(l.name, l.colorNumber, l.lineTypeName);
    }

    this.setActiveLayer("0");
    this._generateAutocadExtras();
  }

  /**
   * @param {string} name The name of the block.
   * @returns {Block}
   */
  addBlock(name) {
    const block = new Block(name);
    this._blocks[name] = block;
    return block;
  }

  addLayer(name, colorNumber, lineTypeName) {
    this._layers[name] = new Layer(name, colorNumber, lineTypeName);
    return this;
  }

  /**
   * @param {string} name
   * @param {string} description
   * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a
   */
  addLineType(name, description, elements) {
    this._lineTypes[name] = new LineType(name, description, elements);
    return this;
  }

  /**
   * @param {string} name
   * @returns {Table}
   */
  addTable(name) {
    const table = new Table(name);
    this._tables[name] = table;
    return table;
  }

  /**
   * @param {number} x1 - Center x
   * @param {number} y1 - Center y
   * @param {number} r - radius
   * @param {number} startAngle - degree
   * @param {number} endAngle - degree
   * @returns {Promise<StreamableDrawing>}
   */
  async drawArc(x1, y1, r, startAngle, endAngle) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Arc(x1, y1, r, startAngle, endAngle));
    return this;
  }

  /**
   * @param {number} x1 - Center x
   * @param {number} y1 - Center y
   * @param {number} r - radius
   * @returns {Promise<StreamableDrawing>}
   */
  async drawCircle(x1, y1, r) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Circle(x1, y1, r));
    return this;
  }

  /**
   * @param {number} x1 - Center x
   * @param {number} y1 - Center y
   * @param {number} z1 - Center z
   * @param {number} r - radius
   * @param {number} thickness - thickness
   * @param {number} extrusionDirectionX - Extrusion Direction x
   * @param {number} extrusionDirectionY - Extrusion Direction y
   * @param {number} extrusionDirectionZ - Extrusion Direction z
   * @returns {Promise<StreamableDrawing>}
   */
  async drawCylinder(
    x1,
    y1,
    z1,
    r,
    thickness,
    extrusionDirectionX,
    extrusionDirectionY,
    extrusionDirectionZ
  ) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Cylinder(
      x1,
      y1,
      z1,
      r,
      thickness,
      extrusionDirectionX,
      extrusionDirectionY,
      extrusionDirectionZ
    )
    );
    return this;
  }

  /**
   * Draw an ellipse.
   * @param {number} x1 - Center x
   * @param {number} y1 - Center y
   * @param {number} majorAxisX - Endpoint x of major axis, relative to center
   * @param {number} majorAxisY - Endpoint y of major axis, relative to center
   * @param {number} axisRatio - Ratio of minor axis to major axis
   * @param {number | undefined} startAngle - Start angle
   * @param {number | undefined} endAngle - End angle
   * @returns {Promise<StreamableDrawing>}
   */
  async drawEllipse(
    x1,
    y1,
    majorAxisX,
    majorAxisY,
    axisRatio,
    startAngle = 0,
    endAngle = 2 * Math.PI
  ) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Ellipse(
      x1,
      y1,
      majorAxisX,
      majorAxisY,
      axisRatio,
      startAngle,
      endAngle
    ));
    return this;
  }

  /**
   * @param {number} x1 - x
   * @param {number} y1 - y
   * @param {number} z1 - z
   * @param {number} x2 - x
   * @param {number} y2 - y
   * @param {number} z2 - z
   * @param {number} x3 - x
   * @param {number} y3 - y
   * @param {number} z3 - z
   * @param {number} x4 - x
   * @param {number} y4 - y
   * @param {number} z4 - z
   * @returns {Promise<StreamableDrawing>}
   */
  async drawFace(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Face(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4));
    return this;
  }

  /**
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @returns {Promise<StreamableDrawing>}
   */
  async drawLine(x1, y1, x2, y2) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Line(x1, y1, x2, y2));
    return this;
  }

  /**
   * @param {number} x1
   * @param {number} y1
   * @param {number} z1
   * @param {number} x2
   * @param {number} y2
   * @param {number} z2
   * @returns {Promise<StreamableDrawing>}
   */
  async drawLine3d(x1, y1, z1, x2, y2, z2) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Line3d(x1, y1, z1, x2, y2, z2));
    return this;
  }

  /**
   * @param {[number, number, number][]} vertices - Array of vertices like [ [x1, y1, z3], [x2, y2, z3]... ]
   * @param {number[][]} faceIndices - Array of face indices
   * @returns {Promise<StreamableDrawing>}
   */
  async drawMesh(vertices, faceIndices) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Mesh(vertices, faceIndices));
    return this;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {Promise<StreamableDrawing>}
   */
  async drawPoint(x, y) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Point(x, y));
    return this;
  }

  /**
   * Draw a regular convex polygon as a polyline entity.
   *
   * @see [Regular polygon | Wikipedia](https://en.wikipedia.org/wiki/Regular_polygon)
   *
   * @param {number} x - The X coordinate of the center of the polygon.
   * @param {number} y - The Y coordinate of the center of the polygon.
   * @param {number} numberOfSides - The number of sides.
   * @param {number} radius - The radius.
   * @param {number} rotation - The  rotation angle (in Degrees) of the polygon. By default 0.
   * @param {boolean} circumscribed - If `true` is a polygon in which each side is a tangent to a circle.
   * If `false` is a polygon in which all vertices lie on a circle. By default `false`.
   *
   * @returns {Promise<StreamableDrawing>}
   */
  async drawPolygon(
    x,
    y,
    numberOfSides,
    radius,
    rotation = 0,
    circumscribed = false
  ) {
    const angle = (2 * Math.PI) / numberOfSides;
    const vertices = [];
    let d = radius;
    const rotationRad = (rotation * Math.PI) / 180;
    if (circumscribed) d = radius / Math.cos(Math.PI / numberOfSides);
    for (let i = 0; i < numberOfSides; i++) {
      vertices.push([
        x + d * Math.sin(rotationRad + i * angle),
        y + d * Math.cos(rotationRad + i * angle),
      ]);
    }
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Polyline(vertices, true));
    return this;
  }

  /**
   * @param {[number, number][]} points - Array of points like [ [x1, y1], [x2, y2]... ]
   * @param {boolean} closed - Closed polyline flag
   * @param {number} startWidth - Default start width
   * @param {number} endWidth - Default end width
   * @returns {Promise<StreamableDrawing>}
   */
  async drawPolyline(points, closed = false, startWidth = 0, endWidth = 0) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Polyline(points, closed, startWidth, endWidth));
    return this;
  }

  /**
   * @param {[number, number, number][]} points - Array of points like [ [x1, y1, z1], [x2, y2, z1]... ]
   * @returns {Promise<StreamableDrawing>}
   */
  async drawPolyline3d(points) {
    points.forEach((point) => {
      if (point.length !== 3) {
        throw "Require 3D coordinates";
      }
    });
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Polyline3d(points));
    return this;
  }

  /**
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number} cornerLength
   * @param {number} cornerBulge
   * @returns {Promise<StreamableDrawing>}
   */
  async drawRect(x1, y1, x2, y2, cornerLength, cornerBulge) {
    const w = x2 - x1;
    const h = y2 - y1;
    cornerBulge = cornerBulge || 0;
    let p = null;
    if (!cornerLength) {
      p = new Polyline(
        [
          [x1, y1],
          [x1, y1 + h],
          [x1 + w, y1 + h],
          [x1 + w, y1],
        ],
        true
      );
    } else {
      p = new Polyline(
        [
          [x1 + w - cornerLength, y1, cornerBulge], // 1
          [x1 + w, y1 + cornerLength], // 2
          [x1 + w, y1 + h - cornerLength, cornerBulge], // 3
          [x1 + w - cornerLength, y1 + h], // 4
          [x1 + cornerLength, y1 + h, cornerBulge], // 5
          [x1, y1 + h - cornerLength], // 6
          [x1, y1 + cornerLength, cornerBulge], // 7
          [x1 + cornerLength, y1], // 8
        ],
        true
      );
    }
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, p);
    return this;
  }

  /**
   * Draw a spline.
   * @param {[Array]} controlPoints - Array of control points like [ [x1, y1], [x2, y2]... ]
   * @param {number | undefined} degree - Degree of spline: 2 for quadratic, 3 for cubic. Default is 3
   * @param {[number] | undefined} knots - Knot vector array. If null, will use a uniform knot vector. Default is null
   * @param {[number] | undefined} weights - Control point weights. If provided, must be one weight for each control point. Default is null
   * @param {[Array] | undefined} fitPoints - Array of fit points like [ [x1, y1], [x2, y2]... ]
   * @returns {Promise<StreamableDrawing>}
   */
  async drawSpline(
    controlPoints,
    degree = 3,
    knots = null,
    weights = null,
    fitPoints = []
  ) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Spline(controlPoints, degree, knots, weights, fitPoints));
    return this;
  }

  /**
   * @param {number} x1 - x
   * @param {number} y1 - y
   * @param {number} height - Text height
   * @param {number} rotation - Text rotation
   * @param {string} value - the string itself
   * @param {string} [horizontalAlignment="left"] left | center | right
   * @param {string} [verticalAlignment="baseline"] baseline | bottom | middle | top
   * @returns {Promise<StreamableDrawing>}
   */
  async drawText(
    x1,
    y1,
    height,
    rotation,
    value,
    horizontalAlignment = "left",
    verticalAlignment = "baseline"
  ) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Text(
      x1,
      y1,
      height,
      rotation,
      value,
      horizontalAlignment,
      verticalAlignment
    )
    );
    return this;
  }

  /**
   * @param {number} x1 - x
   * @param {number} y1 - y
   * @param {number} z1 - z
   * @returns {Promise<StreamableDrawing>}
   */
  async drawVertex(x1, y1, z1) {
    await this._activeLayer.writeShape(this._modelSpace, this._tempShapes.tagsManager, new Vertex(x1, y1, z1));
    return this;
  }

  async end() {
    const headerStream = await this._writeHeader();
    const bodyStream = await this._writeBody();
    const footerStream = await this._writeFooter();

    await this._pipeline([headerStream, bodyStream, footerStream], fs.createWriteStream(this._filepath));
  }

  /**
   * Generate additional DXF metadata which are required to successfully open resulted document
   * in AutoDesk products. Call this method before serializing the drawing to get the most
   * compatible result.
   */
  _generateAutocadExtras() {
    if (!this._headers["ACADVER"]) {
      /* AutoCAD 2010 version. */
      this.header("ACADVER", [[1, "AC1024"]]);
    }

    if (!this._lineTypes["ByBlock"]) {
      this.addLineType("ByBlock", "", []);
    }
    if (!this._lineTypes["ByLayer"]) {
      this.addLineType("ByLayer", "", []);
    }

    let vpTable = this._tables["VPORT"];
    if (!vpTable) {
      vpTable = this.addTable("VPORT");
    }
    let styleTable = this._tables["STYLE"];
    if (!styleTable) {
      styleTable = this.addTable("STYLE");
    }
    if (!this._tables["VIEW"]) {
      this.addTable("VIEW");
    }
    if (!this._tables["UCS"]) {
      this.addTable("UCS");
    }
    let appIdTable = this._tables["APPID"];
    if (!appIdTable) {
      appIdTable = this.addTable("APPID");
    }
    if (!this._tables["DIMSTYLE"]) {
      const t = new DimStyleTable("DIMSTYLE");
      this._tables["DIMSTYLE"] = t;
    }

    vpTable.add(new Viewport("*ACTIVE", 1000));

    /* Non-default text alignment is not applied without this entry. */
    styleTable.add(new TextStyle("standard"));

    appIdTable.add(new AppId("ACAD"));

    this._modelSpace = this.addBlock("*Model_Space");
    this.addBlock("*Paper_Space");

    const d = new Dictionary();
    this._dictionary.addChildDictionary("ACAD_GROUP", d);
  }

  /**
   * @see https://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
   * @see https://www.autodesk.com/techpubs/autocad/acad2000/dxf/header_section_group_codes_dxf_02.htm
   *
   * @param {string} variable
   * @param {array} values Array of "two elements arrays". [  [value1_GroupCode, value1_value], [value2_GroupCode, value2_value]  ]
   * @returns {StreamableDrawing}
   */
  header(variable, values) {
    this._headers[variable] = values;
    return this;
  }

  setActiveLayer(name) {
    this._activeLayer = this._layers[name];
    return this;
  }

  /**
   *
   * @param {number} trueColor - Integer representing the true color, can be passed as an hexadecimal value of the form 0xRRGGBB
   * @returns {StreamableDrawing}
   */
  setTrueColor(trueColor) {
    this._activeLayer.setTrueColor(trueColor);
    return this;
  }

  /**
   * @param {string} unit see StreamableDrawing.UNITS
   */
  setUnits(unit) {
    let units =
      typeof StreamableDrawing.UNITS[unit] != "undefined"
        ? StreamableDrawing.UNITS[unit]
        : StreamableDrawing.UNITS["Unitless"];
    this.header("INSUNITS", [[70, units]]);
    return this;
  }

  async _writeHeader() {
    const { tagsManager, filepath, stream } = this._createTemporaryTagsManager("header.dxf");

    // Setup
    const blockRecordTable = new Table("BLOCK_RECORD");
    const blocks = Object.values(this._blocks);
    for (const b of blocks) {
      const r = new BlockRecord(b.name);
      blockRecordTable.add(r);
    }
    const ltypeTable = this._ltypeTable();
    const layerTable = this._layerTable();
    // Header section start.
    await tagsManager.start("HEADER");
    await tagsManager.addHeaderVariable("HANDSEED", [[5, Handle.peek()]]);
    const variables = Object.entries(this._headers);
    for (const v of variables) {
      const [name, values] = v;
      await tagsManager.addHeaderVariable(name, values);
    }
    await tagsManager.end();
    // Header section end.

    // Classes section start.
    await tagsManager.start("CLASSES");
    // Empty CLASSES section for compatibility
    await tagsManager.end();
    // Classes section end.

    // Tables section start.
    await tagsManager.start("TABLES");
    await ltypeTable.asyncTags(tagsManager);
    await layerTable.asyncTags(tagsManager);
    const tables = Object.values(this._tables);
    for (const t of tables) {
      await t.asyncTags(tagsManager);
    }
    await blockRecordTable.asyncTags(tagsManager);
    await tagsManager.end();
    // Tables section end.

    // Blocks section start.
    await tagsManager.start("BLOCKS");
    for (const b of blocks) {
      await b.asyncTags(tagsManager);
    }
    await tagsManager.end();
    // Blocks section end.

    // Entities section start.
    await tagsManager.start("ENTITIES");
    await tagsManager.writeToStream();
    stream.end();
    await once(stream, "finish");

    return fs.createReadStream(filepath);
  }

  async _writeBody() {
    await this._tempShapes.tagsManager.writeToStream();
    this._tempShapes.stream.end();
    await once(this._tempShapes.stream, "finish");

    return fs.createReadStream(this._tempShapes.filepath);
  }

  async _writeFooter() {
    const { tagsManager, filepath, stream } = this._createTemporaryTagsManager("footer.dxf");

    await tagsManager.end();
    // Entities section end.

    // Objects section start.
    await tagsManager.start("OBJECTS");
    await this._dictionary.asyncTags(tagsManager);
    await tagsManager.end();
    // Objects section end.

    await tagsManager.push(0, "EOF");
    await tagsManager.writeToStream();

    stream.end();
    await once(stream, "finish");

    return fs.createReadStream(filepath);
  }

  _createTemporaryTagsManager(filename) {
    const filepath = path.join(this._tempDir, filename);
    const stream = fs.createWriteStream(filepath);
    return {
      tagsManager: new TagsManagerWithStream(stream),
      filepath,
      stream,
    }
  }

  async _pipeline(readables, writable) {
    for (const readable of readables) {
      await new Promise((resolve, reject) => {
        readable.pipe(writable, { end: false });
        readable.on('end', resolve);
        readable.on('error', reject);
        writable.on('error', reject);
      });
    }

    writable.end();
    await once(writable, 'finish');
  }

  _ltypeTable() {
    const t = new Table("LTYPE");
    const ltypes = Object.values(this._lineTypes);
    for (const lt of ltypes) t.add(lt);
    return t;
  }

  _layerTable() {
    const t = new Table("LAYER");
    const layers = Object.values(this._layers);
    for (const l of layers) t.add(l);
    return t;
  }

  _generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  _makeTempDir() {
    const tempDir = path.join(os.tmpdir(), this._generateRandomString(10));
    fs.mkdirSync(tempDir);
    return tempDir;
  }
}

StreamableDrawing.ACI = Drawing.ACI;
StreamableDrawing.LINE_TYPES = Drawing.LINE_TYPES;
StreamableDrawing.LAYERS = Drawing.LAYERS;
StreamableDrawing.UNITS = Drawing.UNITS;
module.exports = StreamableDrawing;