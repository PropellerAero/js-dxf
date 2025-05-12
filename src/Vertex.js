const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class Vertex extends DatabaseObject {
    /**
     *
     * @param {number} x The X coordinate
     * @param {number} y The Y coordinate
     * @param {number} z The Z coordinate
     */
    constructor(x, y, z) {
        super(["AcDbEntity", "AcDbVertex", "AcDb3dPolylineVertex"]);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        manager.push(0, "VERTEX");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x, this.y, this.z);
        manager.push(70, 32);
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        await manager.push(0, "VERTEX");
        await super.asyncTags(manager);
        await manager.push(8, this.layer.name);
        await manager.point(this.x, this.y, this.z);
        await manager.push(70, 32);
    }
}

module.exports = Vertex;
