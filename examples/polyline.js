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
  d.drawPolyline([ [0,0], [10, 10, 0.5], [20, 10], [30, 0] ], true, 1.5, 1.5);
}

/**
 * @param {StreamableDrawing} d
 * @returns {Promise<void>}
 */
async function asyncDraw(d) {
  d.addLineType('DASHDOT', '_ . _ ', [0.5, -0.5, 0.0, -0.5])
  d.addLayer('l_green', Drawing.ACI.GREEN, 'DASHDOT');
  d.setActiveLayer('l_green');
  await d.drawPolyline([ [0,0], [10, 10, 0.5], [20, 10], [30, 0] ], true, 1.5, 1.5);
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}