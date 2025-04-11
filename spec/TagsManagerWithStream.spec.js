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

  it("pushes tags to the stream once they exceed the writeChunk size", async () => {
    spyOn(stream, "write").and.callThrough();

    const tagsManager = new TagsManagerWithStream(stream, 4);

    await tagsManager.push(0, 0); // each push is 2 lines
    await tagsManager.push(1, 1);

    expect(stream.write).not.toHaveBeenCalled();

    await tagsManager.push(2, 2);

    expect(stream.write).toHaveBeenCalledTimes(1);

    await tagsManager.push(3, 3);

    expect(stream.write).not.toHaveBeenCalledTimes(2);

    await tagsManager.push(4, 4);

    expect(stream.write).toHaveBeenCalledTimes(2);
  });

  it("finishes writing to the stream when writeToStream is called", async () => {
    spyOn(stream, "write").and.callThrough();

    const tagsManager = new TagsManagerWithStream(stream, 4);

    await tagsManager.push(0, 0);
    await tagsManager.push(1, 1);
    await tagsManager.push(2, 2);

    expect(stream.write).toHaveBeenCalledTimes(1);

    await tagsManager.push(3, 3);

    expect(stream.write).not.toHaveBeenCalledTimes(2);

    await tagsManager.writeToStream();

    expect(stream.write).toHaveBeenCalledTimes(2);
  });

  it("throws an error if the stream is not writable", async () => {
    const tagsManager = new TagsManagerWithStream(stream, 4);

    stream.end();

    try {
      await tagsManager.writeToStream();
      fail("Expected writeToStream to throw an error");
    } catch (err) {
      expect(err.message).toBe("Stream is not writable. Reinstantiate the TagsManagerWithStream with a writable stream.");
    }
  });

  it("throws an error if the stream is not writable when pushing", async () => {
    const tagsManager = new TagsManagerWithStream(stream, 4);

    stream.end();

    try {
      await tagsManager.push(0, 0);
      fail("Expected push to throw an error");
    } catch (err) {
      expect(err.message).toBe("Stream is not writable. Reinstantiate the TagsManagerWithStream with a writable stream.");
    }
  });
});
