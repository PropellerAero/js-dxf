const Drawing = require('./../src/Drawing');
const fs = require('fs');

/**
 * @param {Drawing} d
 * @returns {void}
 */
function draw(d) {
  d.addLayer('l_green', Drawing.ACI.RED, 'DOTTED');
  d.setActiveLayer('l_green');
  d.drawArc(50, 50, 50, 30, 90);
}

/**
 * @param {StreamableDrawing} d
 * @returns {Promise<void>}
 */
async function asyncDraw(d) {
  d.addLayer('l_green', Drawing.ACI.RED, 'DOTTED');
  d.setActiveLayer('l_green');
  await d.drawArc(50, 50, 50, 30, 90);
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}