const DatabaseObject = require("./DatabaseObject");
const TagsManager = require("./TagsManager");

const H_ALIGN_CODES = ["left", "center", "right"];
const V_ALIGN_CODES = ["baseline", "bottom", "middle", "top"];

class Text extends DatabaseObject {
    /**
     * @param {number} x - x
     * @param {number} y - y
     * @param {number} height - Text height
     * @param {number} rotation - Text rotation
     * @param {string} value - the string itself
     * @param {string} [horizontalAlignment="left"] left | center | right
     * @param {string} [verticalAlignment="baseline"] baseline | bottom | middle | top
     */
    constructor(
        x,
        y,
        height,
        rotation,
        value,
        horizontalAlignment = "left",
        verticalAlignment = "baseline"
    ) {
        super(["AcDbEntity", "AcDbText"]);
        this.x = x;
        this.y = y;
        this.height = height;
        this.rotation = rotation;
        this.value = value;
        this.hAlign = horizontalAlignment;
        this.vAlign = verticalAlignment;
    }

    /**
     * @param {TagsManager} manager
     * @returns {Promise<void>}
     */
    async tags(manager) {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/text_al_u05_c.htm
        await manager.push(0, "TEXT");
        await super.tags(manager);
        await manager.push(8, this.layer.name);
        await manager.point(this.x, this.y);
        await manager.push(40, this.height);
        await manager.push(1, this.value);
        await manager.push(50, this.rotation);

        if (
            H_ALIGN_CODES.includes(this.hAlign, 1) ||
            V_ALIGN_CODES.includes(this.vAlign, 1)
        ) {
            await manager.push(72, Math.max(H_ALIGN_CODES.indexOf(this.hAlign), 0));

            await manager.push(11, this.x);
            await manager.push(21, this.y);
            await manager.push(31, 0);

            /* AutoCAD needs this one more time, yes, exactly here. */
            await manager.push(100, "AcDbText");
            await manager.push(73, Math.max(V_ALIGN_CODES.indexOf(this.vAlign), 0));
        } else {
            /* AutoCAD needs this one more time. */
            await manager.push(100, "AcDbText");
        }
    }
}

module.exports = Text;
