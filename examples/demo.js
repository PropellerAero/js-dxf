const NodeJsDrawing = require('../src/NodeJsDrawing');
const BrowserFriendlyDrawing = require('../src/BrowserFriendlyDrawing');
const mainModule = require('./mainModule');

/**
 * @param {BrowserFriendlyDrawing | NodeJsDrawing} d
 * @returns {Promise<void>}
 */
async function draw(d) {
  await d.drawText(10, 0, 10, 0, 'Hello World'); // draw text in the default layer named "0"
  d.addLayer('l_green', NodeJsDrawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');
  await d.drawText(20, -70, 10, 0, 'go green!');

  //or fluent
  d.addLayer('l_yellow', NodeJsDrawing.ACI.YELLOW, 'DOTTED')
   .setActiveLayer('l_yellow');
  await d.drawCircle(50, -30, 25);
}

module.exports = { draw };

if (require.main === module) {
  mainModule(draw);
}