const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  d.addLayer("inscribed_polygon", NodeJsDrawing.ACI.YELLOW, "CONTINUOUS");
  d.setActiveLayer("inscribed_polygon");

  await d.drawPolygon(0, 0, 5, 10, 45); // Rotated with 45°
  await d.drawCircle(0, 0, 10);
  await d.drawText(-3, 0, 1, 0, "Inscribed");

  d.addLayer("circumscribed_polygon", NodeJsDrawing.ACI.GREEN, "CONTINUOUS");
  d.setActiveLayer("circumscribed_polygon");

  await d.drawPolygon(30, 0, 5, 10, 0, true);
  await d.drawCircle(30, 0, 10);
  await d.drawText(25, 0, 1, 0, "Circumscribed");
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}