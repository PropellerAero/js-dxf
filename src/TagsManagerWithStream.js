const { once } = require('node:stream');

const DEFAULT_WRITE_CHUNK_SIZE = 2000;
const STREAM_NOT_WRITABLE_ERROR = "Stream is not writable. Reinstantiate the TagsManagerWithStream with a writable stream.";

class TagsManagerWithStream {
  constructor(stream, writeChunkSize = DEFAULT_WRITE_CHUNK_SIZE) {
    this._writeChunkSize = writeChunkSize;
    this._stream = stream;
    this._lines = [];
  }

  /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Promise<void>}
     */
  async point(x, y, z = 0) {
    await this.push(10, x);
    await this.push(20, y);
    await this.push(30, z);
  }

  /**
   * @param {string} name The name of the section
   * @returns {Promise<void>}
   */
  async start(name) {
    await this.push(0, "SECTION");
    await this.push(2, name);
  }

  /**
   * @returns {Promise<void>}
   */
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
    if (!this._stream.writable) {
      throw new Error(STREAM_NOT_WRITABLE_ERROR);
    }

    this._lines.push(code, value);

    if (this._lines.length > this._writeChunkSize) {
      await this._writeChunkToStream(this._lines.splice(0, this._writeChunkSize));
    }
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
    if (mustDrain) await once(this._stream, 'drain');
  }
}

module.exports = TagsManagerWithStream;
