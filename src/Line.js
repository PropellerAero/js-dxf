const DatabaseObject = require("./DatabaseObject");

class Line extends DatabaseObject {
    constructor(x1, y1, x2, y2) {
        super(["AcDbEntity", "AcDbLine"]);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    async tags(manager) {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/line_al_u05_c.htm
        await manager.push(0, "LINE");
        await super.tags(manager);
        await manager.push(8, this.layer.name);
        await manager.point(this.x1, this.y1);

        await manager.push(11, this.x2);
        await manager.push(21, this.y2);
        await manager.push(31, 0);
    }
}

module.exports = Line;
