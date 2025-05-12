const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class BlockRecord extends DatabaseObject {
    constructor(name) {
        super(["AcDbSymbolTableRecord", "AcDbBlockTableRecord"]);
        this.name = name;
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        manager.push(0, "BLOCK_RECORD");
        super.tags(manager);
        manager.push(2, this.name);
        /* No flags set */
        manager.push(70, 0);
        /* Block explodability */
        manager.push(280, 0);
        /* Block scalability */
        manager.push(281, 1);
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        await manager.push(0, "BLOCK_RECORD");
        await super.asyncTags(manager);
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
