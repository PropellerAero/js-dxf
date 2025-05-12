const DatabaseObject = require("./DatabaseObject");
const Handle = require("./Handle");
const Vertex = require("./Vertex");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class Polyline3d extends DatabaseObject {
    /**
     * @param {[number, number, number][]} points - Array of points like [ [x1, y1, z1], [x2, y2, z2]... ]
     */
    constructor(points) {
        super(["AcDbEntity", "AcDb3dPolyline"]);
        this.verticies = points.map((point) => {
            const [x, y, z] = point;
            const vertex = new Vertex(x, y, z);
            vertex.ownerObjectHandle = this.handle;
            return vertex;
        });
        this.seqendHandle = Handle.next();
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        manager.push(0, "POLYLINE");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.push(66, 1);
        manager.push(70, 0);
        manager.point(0, 0);

        for (const vertex of this.verticies) {
            vertex.layer = this.layer;
            vertex.tags(manager);
        }

        manager.push(0, "SEQEND");
        manager.push(5, this.seqendHandle);
        manager.push(100, "AcDbEntity");
        manager.push(8, this.layer.name);
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        await manager.push(0, "POLYLINE");
        await super.asyncTags(manager);
        await manager.push(8, this.layer.name);
        await manager.push(66, 1);
        await manager.push(70, 0);
        await manager.point(0, 0);

        for (const vertex of this.verticies) {
            vertex.layer = this.layer;
            await vertex.asyncTags(manager);
        }

        await manager.push(0, "SEQEND");
        await manager.push(5, this.seqendHandle);
        await manager.push(100, "AcDbEntity");
        await manager.push(8, this.layer.name);
    }
}

module.exports = Polyline3d;
