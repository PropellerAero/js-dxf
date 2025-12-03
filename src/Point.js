const DatabaseObject = require('./DatabaseObject');
const TagsManager = require('./TagsManager');

class Point extends DatabaseObject {
  constructor(x, y, z = 0) {
    super(['AcDbEntity', 'AcDbPoint']);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * @param {TagsManager} manager
   * @returns {Promise<void>}
   */
  async tags(manager) {
    //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/point_al_u05_c.htm
    await manager.push(0, 'POINT');
    await super.tags(manager);
    await manager.push(8, this.layer.name);
    await manager.point(this.x, this.y, this.z);
  }
}

module.exports = Point;
