'use strict';

const fs = require("fs");
const TagsManagerWithStream = require("../src/TagsManagerWithStream");

describe("TagsManagerWithStream", () => {
  const filePath = "output/tagsManagerWithStream.dxf";
  let stream;

  beforeAll(() => {
    if (!fs.existsSync("output")) {
      fs.mkdirSync("output");
    }
  })

  beforeEach(() => {
    stream = new fs.createWriteStream(filePath);
    stream.on("end", () => {
      fs.rmSync(filePath, { force: true });
    });
    stream.on("finish", () => {
      fs.rmSync(filePath, { force: true });
    });
    stream.on("close", () => {
      fs.rmSync(filePath, { force: true });
    });
    stream.on("error", (err) => {
      fs.rmSync(filePath, { force: true });
    });
  });

  afterEach(() => {
    if (stream) {
      stream.end();
      stream = null;
    }
  });

  it("attaches a drain event handler", () => {
    spyOn(stream, "on").and.callThrough();

    new TagsManagerWithStream(stream);

    expect(stream.on).toHaveBeenCalledWith("drain", jasmine.any(Function));
  });

  it("pushes tags to the stream once they exceed the writeChunk size", () => {
    spyOn(stream, "write").and.callThrough();

    const tagsManager = new TagsManagerWithStream(stream, 4);

    tagsManager.push(0, 0); // each push is 2 lines
    tagsManager.push(1, 1);

    expect(stream.write).not.toHaveBeenCalled();

    tagsManager.push(2, 2);

    expect(stream.write).toHaveBeenCalledTimes(1);

    tagsManager.push(3, 3);

    expect(stream.write).not.toHaveBeenCalledTimes(2);

    tagsManager.push(4, 4);

    expect(stream.write).toHaveBeenCalledTimes(2);
  });

  it("finishes writing to the stream when writeToStream is called", () => {
    spyOn(stream, "write").and.callThrough();

    const tagsManager = new TagsManagerWithStream(stream, 4);

    tagsManager.push(0, 0);
    tagsManager.push(1, 1);
    tagsManager.push(2, 2);

    expect(stream.write).toHaveBeenCalledTimes(1);

    tagsManager.push(3, 3);

    expect(stream.write).not.toHaveBeenCalledTimes(2);

    tagsManager.writeToStream();

    expect(stream.write).toHaveBeenCalledTimes(2);
  });

  it("throws an error if the stream is not writable", () => {
    const tagsManager = new TagsManagerWithStream(stream, 4);

    stream.end();

    expect(() => {
      tagsManager.writeToStream();
    }).toThrowError("Stream is not writable. Reinstantiate the TagsManagerWithStream with a writable stream.");
  });

  it("throws an error if the stream is not writable when pushing", () => {
    const tagsManager = new TagsManagerWithStream(stream, 4);

    stream.end();

    expect(() => {
      tagsManager.push(0, 0);
    }).toThrowError("Stream is not writable. Reinstantiate the TagsManagerWithStream with a writable stream.");
  });

  it("cleans up the stream after writing", () => {
    spyOn(stream, "removeAllListeners").and.callThrough();

    const tagsManager = new TagsManagerWithStream(stream, 4);

    tagsManager.writeToStream();

    expect(stream.removeAllListeners).toHaveBeenCalledWith("drain");
  });
});
