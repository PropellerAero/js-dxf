const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  d.setUnits('Decimeters');
  d.addLineType('DASHDOT', '_ . _ ', [0.5, -0.5, 0.0, -0.5]);
  d.addLayer('l_green', NodeJsDrawing.ACI.GREEN, 'DASHDOT');
  d.setActiveLayer('l_green');
  await d.drawCircle(0, 0, 20);
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}