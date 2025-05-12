const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");
const TagsManagerWithStream = require("./TagsManagerWithStream");

class Ellipse extends DatabaseObject {
    /**
     * Creates an ellipse.
     * @param {number} x - Center x
     * @param {number} y - Center y
     * @param {number} majorAxisX - Endpoint x of major axis, relative to center
     * @param {number} majorAxisY - Endpoint y of major axis, relative to center
     * @param {number} axisRatio - Ratio of minor axis to major axis
     * @param {number} startAngle - Start angle
     * @param {number} endAngle - End angle
     */
    constructor(x, y, majorAxisX, majorAxisY, axisRatio, startAngle, endAngle) {
        super(["AcDbEntity", "AcDbEllipse"]);
        this.x = x;
        this.y = y;
        this.majorAxisX = majorAxisX;
        this.majorAxisY = majorAxisY;
        this.axisRatio = axisRatio;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    /**
     * @param {TagsManager} manager
     */
    tags(manager) {
        // https://www.autodesk.com/techpubs/autocad/acadr14/dxf/ellipse_al_u05_c.htm
        manager.push(0, "ELLIPSE");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x, this.y);
        manager.push(11, this.majorAxisX);
        manager.push(21, this.majorAxisY);
        manager.push(31, 0);

        manager.push(40, this.axisRatio);
        manager.push(41, this.startAngle);
        manager.push(42, this.endAngle);
    }

    /**
     * @param {TagsManagerWithStream} manager
     * @returns {Promise<void>}
     */
    async asyncTags(manager) {
        // https://www.autodesk.com/techpubs/autocad/acadr14/dxf/ellipse_al_u05_c.htm
        await manager.push(0, "ELLIPSE");
        await super.asyncTags(manager);
        await manager.push(8, this.layer.name);
        await manager.point(this.x, this.y);
        await manager.push(11, this.majorAxisX);
        await manager.push(21, this.majorAxisY);
        await manager.push(31, 0);

        await manager.push(40, this.axisRatio);
        await manager.push(41, this.startAngle);
        await manager.push(42, this.endAngle);
    }
}

module.exports = Ellipse;
