const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class AppId extends DatabaseObject {
    constructor(name) {
        super(["AcDbSymbolTableRecord", "AcDbRegAppTableRecord"]);
        this.name = name;
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        manager.push(0, "APPID");
        super.tags(manager);
        manager.push(2, this.name);
        /* No flags set */
        manager.push(70, 0);
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        await manager.push(0, "APPID");
        await super.asyncTags(manager);
        await manager.push(2, this.name);
        /* No flags set */
        await manager.push(70, 0);
    }
}

module.exports = AppId;
