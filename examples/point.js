const Drawing = require('./../src/Drawing');
const fs = require('fs');

/**
 * @param {Drawing} d
 * @returns {void}
 */
function draw(d) {
  d.addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');

  d.drawPoint(50, 50)
   .drawPoint(60,60)
   .drawPoint(70,70)
   .drawPoint(80,80)
}

/**
 * @param {StreamableDrawing} d
 * @returns {Promise<void>}
 */
async function asyncDraw(d) {
  d.addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');

   await d.drawPoint(50, 50);
   await d.drawPoint(60,60);
   await d.drawPoint(70,70);
   await d.drawPoint(80,80);
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}