const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");

class BlockRecord extends DatabaseObject {
    constructor(name) {
        super(["AcDbSymbolTableRecord", "AcDbBlockTableRecord"]);
        this.name = name;
    }

    /**
     * @param {TagsManager} manager
     * @returns {Promise<void>}
     */
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
