const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  await d.drawEllipse(10, 10, 5, 0, 0.5);
  await d.drawEllipse(10, 10, 3.53, 3.53, 0.5);
  await d.drawEllipse(10, 10, 0, 5, 0.5);
  await d.drawEllipse(10, 10, -3.53, 3.53, 0.5);
  await d.drawEllipse(10, 10, 8, 0, 1, 0, 1.57);
  await d.drawEllipse(10, 10, 8, 0, 1, 3.14, 4.71);
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}