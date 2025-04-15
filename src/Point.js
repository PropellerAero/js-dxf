const DatabaseObject = require("./DatabaseObject");

class Point extends DatabaseObject {
    constructor(x, y) {
        super(["AcDbEntity", "AcDbPoint"]);
        this.x = x;
        this.y = y;
    }

    async tags(manager) {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/point_al_u05_c.htm
        await manager.push(0, "POINT");
        await super.tags(manager);
        await manager.push(8, this.layer.name);
        await manager.point(this.x, this.y);
    }
}

module.exports = Point;
