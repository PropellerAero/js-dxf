const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");

class TextStyle extends DatabaseObject {
    fontFileName = 'txt';
    constructor(name) {
        super(["AcDbSymbolTableRecord", "AcDbTextStyleTableRecord"]);
        this.name = name;
    }

    /**
     * @param {TagsManager} manager
     * @returns {Promise<void>}
     */
    async tags(manager) {
        await manager.push(0, "STYLE");
        await super.tags(manager);
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
