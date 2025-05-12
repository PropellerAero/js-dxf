const Drawing = require('./../src/Drawing');
const fs = require('fs');

function draw(d) {
  d.addLayer('face_example', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('face_example');

  d.drawFace(
    0, 0, 0,
    0, 1, 1,
    1, 1, 0,
    0, 0, 0)
}

async function asyncDraw(d) {
  d.addLayer('face_example', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('face_example');

  await d.drawFace(
    0, 0, 0,
    0, 1, 1,
    1, 1, 0,
    0, 0, 0)
}

module.exports = { asyncDraw, draw };

if (require.main === module) {
  let d = new Drawing();

  draw(d);

  fs.writeFileSync(__filename + '.dxf', d.toDxfString());
}