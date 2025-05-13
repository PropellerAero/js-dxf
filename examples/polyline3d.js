const Drawing = require('./../src/Drawing');
const fs = require('fs');
const polylines = require('./polyline3d.json');

/**
 * @param {Drawing} d
 * @returns {void}
 */
function draw(d) {
  d.addLayer('contours', Drawing.ACI.YELLOW);
  d.setActiveLayer('contours');

  for (const polyline of polylines) {
    d.drawPolyline3d(polyline);
  }
}

/**
 * @param {StreamableDrawing} d
 * @returns {Promise<void>}
 */
async function asyncDraw(d) {
  d.addLayer('contours', Drawing.ACI.YELLOW);
  d.setActiveLayer('contours');

  for (const polyline of polylines) {
    await d.drawPolyline3d(polyline);
  }
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}