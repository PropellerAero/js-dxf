const DatabaseObject = require("./DatabaseObject");

class Circle extends DatabaseObject {
    /**
     * @param {number} x - Center x
     * @param {number} y - Center y
     * @param {number} r - radius
     */
    constructor(x, y, r) {
        super(["AcDbEntity", "AcDbCircle"]);
        this.x = x;
        this.y = y;
        this.r = r;
    }

    async tags(manager) {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/circle_al_u05_c.htm
        await manager.push(0, "CIRCLE");
        await super.tags(manager);
        await manager.push(8, this.layer.name);
        await manager.point(this.x, this.y);
        await manager.push(40, this.r);
    }
}

module.exports = Circle;
