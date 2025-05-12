const os = require('os');
const fs = require('fs');
const path = require('path');

const Drawing = require('./Drawing');
const Handle = require('./Handle');
const LineType = require("./LineType");
const Layer = require("./Layer");
const Table = require("./Table");
const DimStyleTable = require("./DimStyleTable");
const TextStyle = require("./TextStyle");
const Viewport = require("./Viewport");
const AppId = require("./AppId");
const Block = require("./Block");
const BlockRecord = require("./BlockRecord");
const Dictionary = require("./Dictionary");
const Mesh = require("./Mesh");
const Polyline3d = require("./Polyline3d");
const TagsManagerWithStream = require("./TagsManagerWithStream");
const { once } = require('node:stream');

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
    this.generateAutocadExtras();
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

  addLayer(name, colorNumber, lineTypeName) {
    this._layers[name] = new Layer(name, colorNumber, lineTypeName);
    return this;
  }

  setActiveLayer(name) {
    this._activeLayer = this._layers[name];
    return this;
  }

  addTable(name) {
    const table = new Table(name);
    this._tables[name] = table;
    return table;
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

  /**
   * @param {[number, number, number][]} vertices - Array of vertices like [ [x1, y1, z3], [x2, y2, z3]... ]
   * @param {number[][]} faceIndices - Array of face indices
   */
  async drawMesh(vertices, faceIndices) {
    await this._activeLayer.writeShape(this.modelSpace, this._tempShapes.tagsManager, new Mesh(vertices, faceIndices));
    return this;
  }

  /**
   * @param {[number, number, number][]} points - Array of points like [ [x1, y1, z1], [x2, y2, z1]... ]
   */
  async drawPolyline3d(points) {
    points.forEach((point) => {
      if (point.length !== 3) {
        throw "Require 3D coordinates";
      }
    });
    await this._activeLayer.writeShape(this.modelSpace, this._tempShapes.tagsManager, new Polyline3d(points));
    return this;
  }

  /**
   *
   * @param {number} trueColor - Integer representing the true color, can be passed as an hexadecimal value of the form 0xRRGGBB
   */
  setTrueColor(trueColor) {
    this._activeLayer.setTrueColor(trueColor);
    return this;
  }

  /**
   * @see https://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
   * @see https://www.autodesk.com/techpubs/autocad/acad2000/dxf/header_section_group_codes_dxf_02.htm
   *
   * @param {string} variable
   * @param {array} values Array of "two elements arrays". [  [value1_GroupCode, value1_value], [value2_GroupCode, value2_value]  ]
   */
  header(variable, values) {
    this._headers[variable] = values;
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

  /**
   * Generate additional DXF metadata which are required to successfully open resulted document
   * in AutoDesk products. Call this method before serializing the drawing to get the most
   * compatible result.
   */
  generateAutocadExtras() {
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

    this.modelSpace = this.addBlock("*Model_Space");
    this.addBlock("*Paper_Space");

    const d = new Dictionary();
    this._dictionary.addChildDictionary("ACAD_GROUP", d);
  }

  async end() {
    const headerStream = await this._writeHeader();
    const bodyStream = await this._writeBody();
    const footerStream = await this._writeFooter();

    await this._pipeline([headerStream, bodyStream, footerStream], fs.createWriteStream(this._filepath));
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