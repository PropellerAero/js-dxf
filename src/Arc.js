const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class Arc extends DatabaseObject {
    /**
     * @param {number} x - Center x
     * @param {number} y - Center y
     * @param {number} r - radius
     * @param {number} startAngle - degree
     * @param {number} endAngle - degree
     */
    constructor(x, y, r, startAngle, endAngle) {
        super(["AcDbEntity", "AcDbCircle"]);
        this.x = x;
        this.y = y;
        this.r = r;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/line_al_u05_c.htm
        manager.push(0, "ARC");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x, this.y);
        manager.push(40, this.r);
        manager.push(100, "AcDbArc");
        manager.push(50, this.startAngle);
        manager.push(51, this.endAngle);
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/line_al_u05_c.htm
        await manager.push(0, "ARC");
        await super.asyncTags(manager);
        await manager.push(8, this.layer.name);
        await manager.point(this.x, this.y);
        await manager.push(40, this.r);
        await manager.push(100, "AcDbArc");
        await manager.push(50, this.startAngle);
        await manager.push(51, this.endAngle);
    }
}

module.exports = Arc;
