const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  d.addLayer('l_firebrick', 0, 'CONTINUOUS');
  d.setActiveLayer('l_firebrick');
  d.setTrueColor(0xB22222);
  await d.drawCircle(-10, 10, 5);

  d.addLayer('l_gold', 0, 'CONTINUOUS');
  d.setActiveLayer('l_gold');
  d.setTrueColor(0xFFD700);
  await d.drawCircle(10, 10, 5);

  d.addLayer('l_mediumseagreen', 0, 'CONTINUOUS');
  d.setActiveLayer('l_mediumseagreen');
  d.setTrueColor(0x3CB371);
  await d.drawCircle(-10, -10, 5);

  d.addLayer('l_midnightblue', 0, 'CONTINUOUS');
  d.setActiveLayer('l_midnightblue');
  d.setTrueColor(0x191970);
  await d.drawCircle(10, -10, 5);
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}