const Drawing = require('./../src/Drawing');
const fs = require('fs');

function draw(d) {
  d.setUnits('Decimeters');
  d.addLineType('DASHDOT', '_ . _ ', [0.5, -0.5, 0.0, -0.5]);
  d.addLayer('l_green', Drawing.ACI.GREEN, 'DASHDOT');
  d.setActiveLayer('l_green');
  d.drawCircle(0, 0, 20);
}

module.exports = { draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}