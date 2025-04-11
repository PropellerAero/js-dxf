const DatabaseObject = require("./DatabaseObject");

class AppId extends DatabaseObject {
    constructor(name) {
        super(["AcDbSymbolTableRecord", "AcDbRegAppTableRecord"]);
        this.name = name;
    }

    async tags(manager) {
        await manager.push(0, "APPID");
        await super.tags(manager);
        await manager.push(2, this.name);
        await /* No flags set */
        await manager.push(70, 0);
    }
}

module.exports = AppId;
