const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");

class Table extends DatabaseObject {
    constructor(name) {
        super("AcDbSymbolTable");
        this.name = name;
        this.elements = [];
    }

    add(element) {
        element.ownerObjectHandle = this.handle;
        this.elements.push(element);
    }

    /**
     * @param {TagsManager} manager
     * @returns {Promise<void>}
     */
    async tags(manager) {
        await manager.push(0, "TABLE");
        await manager.push(2, this.name);
        await super.tags(manager);
        await manager.push(70, this.elements.length);

        for (const element of this.elements) {
            await element.tags(manager);
        }

        await manager.push(0, "ENDTAB");
    }
}

module.exports = Table;
