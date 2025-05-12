const DatabaseObject = require("./DatabaseObject");
const Table = require("./Table");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class DimStyleTable extends Table {
    constructor(name) {
        super(name);
        this.subclassMarkers.push("AcDbDimStyleTable");
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        manager.push(0, "TABLE");
        manager.push(2, this.name);
        DatabaseObject.prototype.tags.call(this, manager);
        manager.push(70, this.elements.length);
        /* DIMTOL */
        manager.push(71, 1);

        for (const e of this.elements) {
            e.tags(manager);
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
        await DatabaseObject.prototype.asyncTags.call(this, manager);
        await manager.push(70, this.elements.length);
        /* DIMTOL */
        await manager.push(71, 1);

        for (const e of this.elements) {
            await e.asyncTags(manager);
        }

        await manager.push(0, "ENDTAB");
    }
}

module.exports = DimStyleTable;
