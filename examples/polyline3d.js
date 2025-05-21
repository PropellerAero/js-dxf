const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');
const polylines = require('./polyline3d.json');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  d.addLayer('contours', NodeJsDrawing.ACI.YELLOW);
  d.setActiveLayer('contours');

  for (const polyline of polylines) {
    await d.drawPolyline3d(polyline);
  }
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}