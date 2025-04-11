const Handle = require("./Handle");

class DatabaseObject {
    constructor(subclass = null) {
        this.handle = Handle.next();
        this.ownerObjectHandle = "0";
        this.subclassMarkers = [];
        if (subclass) {
            if (Array.isArray(subclass)) {
                this.subclassMarkers.push(...subclass);
            } else {
                this.subclassMarkers.push(subclass);
            }
        }
    }

    /**
     *
     * @param {TagsManager} manager
     */
    async tags(manager) {
        await manager.push(5, this.handle);
        await manager.push(330, this.ownerObjectHandle);

        for (const s of this.subclassMarkers) {
            await manager.push(100, s);
        }
    }
}

module.exports = DatabaseObject;
