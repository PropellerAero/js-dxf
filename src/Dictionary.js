const DatabaseObject = require("./DatabaseObject");

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

    async tags(manager) {
        await manager.push(0, "DICTIONARY");
        await super.tags(manager);
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
            await c.tags(manager);
        }
    }
}

module.exports = Dictionary;
