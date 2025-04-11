const TagsManager = require("./TagsManager");

const DEFAULT_WRITE_CHUNK = 2000;
const STREAM_NOT_WRITABLE_ERROR = "Stream is not writable. Reinstantiate the TagsManagerWithStream with a writable stream.";

class TagsManagerWithStream extends TagsManager {
  constructor(stream, writeChunk = DEFAULT_WRITE_CHUNK) {
    super();
    this._writeChunkSize = writeChunk;
    this._stream = stream;
    this._isDraining = false;
    this._stream.on("drain", () => this._resumeWriting());
  }

  push(code, value) {
    super.push(code, value);

    if (!this._stream.writable) {
      throw new Error(STREAM_NOT_WRITABLE_ERROR);
    }

    console.log(this._isDraining)

    if (!this._isDraining && this._lines.length > this._writeChunkSize) {
      this._isDraining = this._writeChunkToStream(this._lines.splice(0, this._writeChunkSize));
    }
  }

  toDxfString() {
    throw new Error("toDxfString is not supported in TagsManagerWithStream. Use writeToStream instead.");
  }

  writeToStream() {
    if (!this._stream.writable) {
      throw new Error(STREAM_NOT_WRITABLE_ERROR);
    }

    this._stream.removeAllListeners('drain');
    this._stream.on("drain", () => this._writeRemainingLines());

    this._writeRemainingLines();
  }

  _writeRemainingLines() {
    while (this._lines.length > 0) {

      const mustDrain = this._writeChunkToStream(this._lines.splice(0, this._writeChunkSize));

      if (mustDrain) {
        break;
      }
    }

    this._cleanupStream();
  }

  _writeChunkToStream(lines) {
    const data = lines.join("\n") + "\n";
    return !this._stream.write(data);
  }

  _cleanupStream() {
    this._stream.removeAllListeners('drain');
  }

  _resumeWriting() {
    this._isDraining = false;
  }
}

module.exports = TagsManagerWithStream;
