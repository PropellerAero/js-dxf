const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class TextStyle extends DatabaseObject {
    fontFileName = 'txt';
    constructor(name) {
        super(["AcDbSymbolTableRecord", "AcDbTextStyleTableRecord"]);
        this.name = name;
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        manager.push(0, "STYLE");
        super.tags(manager);
        manager.push(2, this.name);
        /* No flags set */
        manager.push(70, 0);
        manager.push(40, 0);
        manager.push(41, 1);
        manager.push(50, 0);
        manager.push(71, 0);
        manager.push(42, 1);
        manager.push(3, this.fontFileName);
        manager.push(4, "");
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        await manager.push(0, "STYLE");
        await super.asyncTags(manager);
        await manager.push(2, this.name);
        /* No flags set */
        await manager.push(70, 0);
        await manager.push(40, 0);
        await manager.push(41, 1);
        await manager.push(50, 0);
        await manager.push(71, 0);
        await manager.push(42, 1);
        await manager.push(3, this.fontFileName);
        await manager.push(4, "");
    }
}

module.exports = TextStyle;
