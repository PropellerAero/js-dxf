const Drawing = require('./../src/Drawing');
const fs = require('fs');

function draw(d) {
  d.addLineType('CONTINUOUS', '______', [])
  d.addLayer('l_red', Drawing.ACI.RED, 'CONTINUOUS');
  d.setActiveLayer('l_red');
  d.drawPolyline3d([ [0, 0, 20], [10, 10, 5], [20, 10, 5], [30, 30, 40] ]);
}

module.exports = { draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}