const Drawing = require('./../src/Drawing');
const fs = require('fs');

function draw(d) {
  d.drawText(10, 0, 10, 0, 'Hello World'); // draw text in the default layer named "0"
  d.addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');
  d.drawText(20, -70, 10, 0, 'go green!');

  //or fluent
  d.addLayer('l_yellow', Drawing.ACI.YELLOW, 'DOTTED')
   .setActiveLayer('l_yellow')
   .drawCircle(50, -30, 25);
}

async function asyncDraw(d) {
  await d.drawText(10, 0, 10, 0, 'Hello World'); // draw text in the default layer named "0"
  d.addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');
  await d.drawText(20, -70, 10, 0, 'go green!');

  //or fluent
  d.addLayer('l_yellow', Drawing.ACI.YELLOW, 'DOTTED')
   .setActiveLayer('l_yellow');
  await d.drawCircle(50, -30, 25);
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}