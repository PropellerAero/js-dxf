const fs = require("fs");
const path = require("path");

function getFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function getExampleFileFixtures() {
  return fs.readdirSync(path.join(__dirname, '..', '..', 'examples'))
    .filter((file) => file.endsWith('.js.dxf') && !file.includes('#'));
}

module.exports = {
  getFile,
  getExampleFileFixtures,
};