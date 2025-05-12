const Drawing = require('./../src/Drawing');
const fs = require('fs');

/**
 * @param {Drawing} d
 * @returns {void}
 */
function draw(d) {
  d.addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');

  d.drawText(0, 0, 10, 0, 'js - DXF');
  d.drawText(0, 15, 10, 0, 'js - DXF', 'center', 'middle');
  d.drawText(0, 20, 10, 0, 'js - DXF', 'right');
}

/**
 * @param {StreamableDrawing} d
 * @returns {Promise<void>}
 */
async function asyncDraw(d) {
  d.addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');

  await d.drawText(0, 0, 10, 0, 'js - DXF');
  await d.drawText(0, 15, 10, 0, 'js - DXF', 'center', 'middle');
  await d.drawText(0, 20, 10, 0, 'js - DXF', 'right');
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}