const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class Block extends DatabaseObject {
    constructor(name) {
        super(["AcDbEntity", "AcDbBlockBegin"]);
        this.name = name;
        this.end = new DatabaseObject(["AcDbEntity", "AcDbBlockEnd"]);
        this.recordHandle = null;
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        manager.push(0, "BLOCK");
        super.tags(manager);
        manager.push(2, this.name);
        /* No flags set */
        manager.push(70, 0);
        /* Block top left corner */
        manager.point(0, 0);
        manager.push(3, this.name);
        /* xref path name - nothing */
        manager.push(1, "");

        //XXX dump content here

        manager.push(0, "ENDBLK");
        this.end.tags(manager);
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        await manager.push(0, "BLOCK");
        await super.asyncTags(manager);
        await manager.push(2, this.name);
        /* No flags set */
        await manager.push(70, 0);
        /* Block top left corner */
        await manager.point(0, 0);
        await manager.push(3, this.name);
        /* xref path name - nothing */
        await manager.push(1, "");

        //XXX dump content here

        await manager.push(0, "ENDBLK");
        await this.end.asyncTags(manager);
    }
}

module.exports = Block;
