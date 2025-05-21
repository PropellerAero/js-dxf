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

   await d.drawPoint(50, 50);
   await d.drawPoint(60,60);
   await d.drawPoint(70,70);
   await d.drawPoint(80,80);
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}