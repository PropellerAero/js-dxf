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
    async point(x, y, z = 0) {
        await this.push(10, x);
        await this.push(20, y);
        await this.push(30, z);
    }

    /**
     *
     * @param {string} name The name of the section
     */
    async start(name) {
        await this.push(0, "SECTION");
        await this.push(2, name);
    }

    async end() {
        await this.push(0, "ENDSEC");
    }

    async addHeaderVariable(name, tagsElements) {
        await this.push(9, `$${name}`);
        for (const tagsElement of tagsElements) {
            await this.push(tagsElement[0], tagsElement[1]);
        };
    }

    async push(code, value) {
        this._lines.push(code, value);
        return Promise.resolve();
    }

    toDxfString() {
        return this._lines.join("\n");
    }
}

module.exports = TagsManager;
