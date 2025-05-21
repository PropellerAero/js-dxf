const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  // The degree 3 spline will be "rounder" than degree 2
  await d.drawSpline([[0, 0], [10, 10], [20, 10], [30, 0]], 2);
  await d.drawSpline([[0, 0], [10, 10], [20, 10], [30, 0]], 3);

  // These are "flatter" on top
  await d.drawSpline([[0, 0], [0, 10], [15, 15], [30, 10], [30, 0]], 2);
  await d.drawSpline([[0, 0], [0, 10], [15, 15], [30, 10], [30, 0]], 3);

  // This one should be skewed to the left
  await d.drawSpline([[0, 0], [0, 10], [15, 15], [30, 10], [30, 0]], 3, [0, 0, 0, 0, 0.5, 2, 2, 2, 2]);

  // This should have a "point" on top
  await d.drawSpline([[0, 0], [0, 10], [15, 15], [30, 10], [30, 0]], 2, [0, 0, 0, 1, 1, 2, 2, 2]);
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}