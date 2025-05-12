const Drawing = require('./../src/Drawing');
const fs = require('fs');

function draw(d) {
  d.addLayer('l_green', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('l_green');

  d.drawPoint(50, 50)
   .drawPoint(60,60)
   .drawPoint(70,70)
   .drawPoint(80,80)
}

module.exports = { draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}