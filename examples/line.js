const Drawing = require('./../src/Drawing');
const fs = require('fs');

function draw(d) {
  d.setUnits('Yards').addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');

  d.drawLine(50, 50, 100, 100)
    .drawLine(100, 100, 150, 50)
    .drawLine(150, 50, 100, 0)
    .drawLine(100, 0, 50, 50)
}

async function asyncDraw(d) {
  d.setUnits('Yards').addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');

  await d.drawLine(50, 50, 100, 100);
  await d.drawLine(100, 100, 150, 50);
  await d.drawLine(150, 50, 100, 0);
  await d.drawLine(100, 0, 50, 50);
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}