const TagsManager = require("./TagsManager");

class TagsStreamManager extends TagsManager {
    constructor(stream) {
        super();
        this.stream = stream;
    }

    push(code, value) {
        this.stream.write(code?.toString() || "");
        this.stream.write("\n");
        this.stream.write(value?.toString() || "");
        this.stream.write("\n");
    }

    toDxfString() {
        throw new Error("toDxfString is unsupported in SteamTagsManager");
    }
}

module.exports = TagsStreamManager;
