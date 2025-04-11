const TagsManager = require("./TagsManager");

const DEFAULT_WRITE_CHUNK = 2000;

class TagsManagerWithStream extends TagsManager {
  constructor(stream, writeChunk = DEFAULT_WRITE_CHUNK) {
    super();
    this.writeChunk = writeChunk;
    this.stream = stream;
    this.isWriting = false;
    this.stream.on("drain", () => this._resumeWriting());
  }

  push(code, value) {
    super.push(code, value);

    if (this.stream && this.stream.writable && !this.isWriting && this.lines.length > this.writeChunk) {
      this._writeChunkToStream(this.lines.splice(0, this.writeChunk));
    }
  }

  toDxfString() {
    throw new Error("toDxfString is not supported in TagsManagerWithStream. Use writeToStream instead.");
  }

  writeToStream() {
    if (!this.stream.writable) {
      throw new Error("Stream is not writable. Reinstantiate the TagsManagerWithStream with a writable stream.");
    }

    while (this.lines.length > 0) {
      if (this.stream && this.stream.writable && !this.isWriting) {
        this._writeChunkToStream(this.lines.splice(0, this.writeChunk));
      }
    }

    this._cleanupStream();
  }

  _writeChunkToStream(lines) {
    this.isWriting = true;
    const data = lines.join("\n") + "\n";
    this.isWriting = this.stream.write(data);
  }

  _cleanupStream() {
    this.stream.removeAllListeners('drain');
  }

  _resumeWriting() {
    this.isWriting = false;
  }
}

module.exports = TagsManagerWithStream;
