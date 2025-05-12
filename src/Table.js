const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

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
     */
    tags(manager) {
        manager.push(0, "TABLE");
        manager.push(2, this.name);
        super.tags(manager);
        manager.push(70, this.elements.length);

        for (const element of this.elements) {
            element.tags(manager);
        }

        manager.push(0, "ENDTAB");
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        await manager.push(0, "TABLE");
        await manager.push(2, this.name);
        await super.asyncTags(manager);
        await manager.push(70, this.elements.length);

        for (const element of this.elements) {
            await element.asyncTags(manager);
        }

        await manager.push(0, "ENDTAB");
    }
}

module.exports = Table;
