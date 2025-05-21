const fs = require('fs');
const { once } = require('../src/once');

module.exports = async (drawFn) => {
  const stream = fs.createWriteStream(__filename + '.dxf');
  const d = new NodeJsDrawing(stream);
  await drawFn(d);
  await d.end();
  stream.end();
  await once(stream, 'finish');
}