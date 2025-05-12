const Drawing = require('./../src/Drawing');
const fs = require('fs');

/**
 * @param {Drawing} d
 * @returns {void}
 */
function draw(d) {
  d.drawEllipse(10, 10, 5, 0, 0.5);
  d.drawEllipse(10, 10, 3.53, 3.53, 0.5);
  d.drawEllipse(10, 10, 0, 5, 0.5);
  d.drawEllipse(10, 10, -3.53, 3.53, 0.5);
  d.drawEllipse(10, 10, 8, 0, 1, 0, 1.57);
  d.drawEllipse(10, 10, 8, 0, 1, 3.14, 4.71);
}

/**
 * @param {StreamableDrawing} d
 * @returns {Promise<void>}
 */
async function asyncDraw(d) {
  await d.drawEllipse(10, 10, 5, 0, 0.5);
  await d.drawEllipse(10, 10, 3.53, 3.53, 0.5);
  await d.drawEllipse(10, 10, 0, 5, 0.5);
  await d.drawEllipse(10, 10, -3.53, 3.53, 0.5);
  await d.drawEllipse(10, 10, 8, 0, 1, 0, 1.57);
  await d.drawEllipse(10, 10, 8, 0, 1, 3.14, 4.71);
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}