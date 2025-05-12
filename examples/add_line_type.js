const StreamableDrawing = require('../src/StreamableDrawing');
const Drawing = require('./../src/Drawing');
const fs = require('fs');

/**
 * @param {Drawing} d
 * @returns {void}
 */
function draw(d) {
  d.addLineType('DASHDOT', '_ . _ ', [0.5, -0.5, 0.0, -0.5])
  d.addLayer('l_green', Drawing.ACI.GREEN, 'DASHDOT');
  d.setActiveLayer('l_green');
  d.drawLine(0, 0, 20, 20);
}

/**
 * @param {StreamableDrawing} d
 * @returns {Promise<void>}
 */
async function asyncDraw(d) {
  d.addLineType('DASHDOT', '_ . _ ', [0.5, -0.5, 0.0, -0.5])
  d.addLayer('l_green', Drawing.ACI.GREEN, 'DASHDOT');
  d.setActiveLayer('l_green');
  await d.drawLine(0, 0, 20, 20);
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}