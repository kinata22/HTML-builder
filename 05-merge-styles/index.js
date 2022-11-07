const path = require('path');
const fs = require("fs");
const fsp = require("fs/promises");

async function readableToString(readable) {
  let result = '';
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

async function readStylesDirectory(stylesPath, bundlePath) {
  let allFiles = [];
  const files = await fsp.readdir(stylesPath, {withFileTypes: true});
  for (let file of files) {
    if(file.isFile() && path.extname(file.name) === '.css') {
      allFiles.push(path.resolve(stylesPath, file.name));
    }
  }

  let styles = [];
  for await (let file of allFiles) {
    const readableStream = fs.createReadStream(file, 'utf-8');
    const text = await readableToString(readableStream);
    styles.push(text);
  }

  var file = fs.createWriteStream(bundlePath);
  file.on('error', function(err) { console.log(err) });
  styles.forEach(value => file.write(`${value}\n`));
  file.end();
}

const stylesDir = path.resolve(__dirname, 'styles');
const distDir = path.resolve(__dirname, 'project-dist', 'bundle.css');

readStylesDirectory(stylesDir, distDir);

