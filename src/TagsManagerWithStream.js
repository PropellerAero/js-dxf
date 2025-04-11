const TagsManager = require("./TagsManager");

const DEFAULT_WRITE_CHUNK_SIZE = 2000;
const STREAM_NOT_WRITABLE_ERROR = "Stream is not writable. Reinstantiate the TagsManagerWithStream with a writable stream.";

class TagsManagerWithStream extends TagsManager {
  constructor(stream, writeChunkSize = DEFAULT_WRITE_CHUNK_SIZE) {
    super();
    this._writeChunkSize = writeChunkSize;
    this._stream = stream;
  }

  async push(code, value) {
    if (!this._stream.writable) {
      throw new Error(STREAM_NOT_WRITABLE_ERROR);
    }

    await super.push(code, value);

    if (this._lines.length > this._writeChunkSize) {
      await this._writeChunkToStream(this._lines.splice(0, this._writeChunkSize));
    }
  }

  toDxfString() {
    throw new Error("toDxfString is not supported in TagsManagerWithStream. Use writeToStream instead.");
  }

  async writeToStream() {
    if (!this._stream.writable) {
      throw new Error(STREAM_NOT_WRITABLE_ERROR);
    }

    while (this._lines.length > 0) {
      await this._writeChunkToStream(this._lines.splice(0, this._writeChunkSize));
    }
  }

  async _writeChunkToStream(lines) {
    const data = lines.join("\n") + "\n";
    const mustDrain = !this._stream.write(data);

    if (mustDrain) {
      await new Promise((resolve) => {
        const drain = () => {
          this._stream.off("drain", drain);
          resolve();
        };
        this._stream.on("drain", drain);
      });
    }
  }
}

module.exports = TagsManagerWithStream;
