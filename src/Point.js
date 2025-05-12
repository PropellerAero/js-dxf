const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class Point extends DatabaseObject {
    constructor(x, y) {
        super(["AcDbEntity", "AcDbPoint"]);
        this.x = x;
        this.y = y;
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/point_al_u05_c.htm
        manager.push(0, "POINT");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x, this.y);
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/point_al_u05_c.htm
        await manager.push(0, "POINT");
        await super.asyncTags(manager);
        await manager.push(8, this.layer.name);
        await manager.point(this.x, this.y);
    }
}

module.exports = Point;
