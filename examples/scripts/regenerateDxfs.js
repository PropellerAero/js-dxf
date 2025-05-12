const fs = require("node:fs/promises");
const path = require("node:path");
const util = require('node:util');

const exec = util.promisify(require('node:child_process').exec);

async function main() {
  const directories = [
    "examples",
  ].map((dir) => path.join(__dirname, "..", "..", dir));

  const relevantJsFiles = await getJsFiles(directories);

  await regenerateDxfs(relevantJsFiles);
}

async function getJsFiles(directories) {
  const jsFiles = [];
  for (const dir of directories) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (file.endsWith(".js") && !file.includes("#")) {
        jsFiles.push(path.join(dir, file));
      }
    }
  }
  return jsFiles;
}

async function regenerateDxfs(jsFiles) {
  for (const jsFile of jsFiles) {
    const dxfFile = `${jsFile}.dxf`;

    console.log(`Regenerating ${dxfFile}`);

    await exec(`node ${jsFile}`);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});