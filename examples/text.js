const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  d.addLayer('l_green', NodeJsDrawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');

  await d.drawText(0, 0, 10, 0, 'js - DXF');
  await d.drawText(0, 15, 10, 0, 'js - DXF', 'center', 'middle');
  await d.drawText(0, 20, 10, 0, 'js - DXF', 'right');
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}