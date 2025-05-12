class TagsManager {
    constructor() {
        this._lines = [];
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    point(x, y, z = 0) {
        this.push(10, x);
        this.push(20, y);
        this.push(30, z);
    }

    /**
     *
     * @param {string} name The name of the section
     */
    start(name) {
        this.push(0, "SECTION");
        this.push(2, name);
    }

    end() {
        this.push(0, "ENDSEC");
    }

    addHeaderVariable(name, tagsElements) {
        this.push(9, `$${name}`);
        for (const tagsElement of tagsElements) {
            this.push(tagsElement[0], tagsElement[1]);
        };
    }

    push(code, value) {
        this._lines.push(code, value);
    }

    toDxfString() {
        return this._lines.join("\n") + "\n";
    }
}

module.exports = TagsManager;
