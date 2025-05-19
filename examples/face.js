const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  d.addLayer('face_example', NodeJsDrawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('face_example');

  await d.drawFace(
    0, 0, 0,
    0, 1, 1,
    1, 1, 0,
    0, 0, 0)
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}