const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');


/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  d.addLayer('l_green', NodeJsDrawing.ACI.RED, 'DOTTED');
  d.setActiveLayer('l_green');
  await d.drawArc(50, 50, 50, 30, 90);
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}