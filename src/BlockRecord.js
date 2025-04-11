const DatabaseObject = require("./DatabaseObject");

class BlockRecord extends DatabaseObject {
    constructor(name) {
        super(["AcDbSymbolTableRecord", "AcDbBlockTableRecord"]);
        this.name = name;
    }

    async tags(manager) {
        await manager.push(0, "BLOCK_RECORD");
        await super.tags(manager);
        await manager.push(2, this.name);
        /* No flags set */
        await manager.push(70, 0);
        /* Block explodability */
        await manager.push(280, 0);
        /* Block scalability */
        await manager.push(281, 1);
    }
}

module.exports = BlockRecord;
