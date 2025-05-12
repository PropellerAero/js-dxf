const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class Dictionary extends DatabaseObject {
    constructor() {
        super("AcDbDictionary");
        this.children = {};
    }

    /**
     *
     * @param {*} name
     * @param {DatabaseObject} dictionary
     */
    addChildDictionary(name, dictionary) {
        dictionary.ownerObjectHandle = this.handle;
        this.children[name] = dictionary;
    }

    /**
     * @param {TagsManager} object
     */
    tags(manager) {
        manager.push(0, "DICTIONARY");
        super.tags(manager);
        /* Duplicate record cloning flag - keep existing */
        manager.push(281, 1);

        const entries = Object.entries(this.children);
        for (const entry of entries) {
            const [name, dic] = entry;
            manager.push(3, name);
            manager.push(350, dic.handle);
        }

        const children = Object.values(this.children);
        for (const c of children) {
            c.tags(manager);
        }
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        await manager.push(0, "DICTIONARY");
        await super.asyncTags(manager);
        /* Duplicate record cloning flag - keep existing */
        await manager.push(281, 1);

        const entries = Object.entries(this.children);
        for (const entry of entries) {
            const [name, dic] = entry;
            await manager.push(3, name);
            await manager.push(350, dic.handle);
        }

        const children = Object.values(this.children);
        for (const c of children) {
            await c.asyncTags(manager);
        }
    }
}

module.exports = Dictionary;
