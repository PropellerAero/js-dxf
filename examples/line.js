const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  d.setUnits('Yards').addLayer('l_green', NodeJsDrawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');

  await d.drawLine(50, 50, 100, 100);
  await d.drawLine(100, 100, 150, 50);
  await d.drawLine(150, 50, 100, 0);
  await d.drawLine(100, 0, 50, 50);
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}