const DatabaseObject = require("./DatabaseObject");
const Table = require("./Table");

class DimStyleTable extends Table {
    constructor(name) {
        super(name);
        this.subclassMarkers.push("AcDbDimStyleTable");
    }

    async tags(manager) {
        await manager.push(0, "TABLE");
        await manager.push(2, this.name);
        await DatabaseObject.prototype.tags.call(this, manager);
        await manager.push(70, this.elements.length);
        /* DIMTOL */
        await manager.push(71, 1);

        for (const e of this.elements) {
            await e.tags(manager);
        }

        await manager.push(0, "ENDTAB");
    }
}

module.exports = DimStyleTable;
