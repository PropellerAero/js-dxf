const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class Viewport extends DatabaseObject {
    constructor(name, height) {
        super(["AcDbSymbolTableRecord", "AcDbViewportTableRecord"]);
        this.name = name;
        this.height = height;
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        manager.push(0, "VPORT");
        super.tags(manager);
        manager.push(2, this.name);
        manager.push(40, this.height);
        /* No flags set */
        manager.push(70, 0);
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        await manager.push(0, "VPORT");
        await super.asyncTags(manager);
        await manager.push(2, this.name);
        await manager.push(40, this.height);
        /* No flags set */
        await manager.push(70, 0);
    }
}

module.exports = Viewport;
