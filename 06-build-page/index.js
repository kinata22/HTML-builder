const path = require('path');
const fs = require("fs");
const fsp = require("fs/promises");

function createDirectory(directoryPath) {
  fs.mkdir(directoryPath, { recursive: true }, (err) => {
    if (err) {
      console.log("Error occurred in creating new directory", err);
      return;
    }
    console.log(`${directoryPath} directory created successfully`);
  });
}

async function readableToString(readable) {
  let result = '';
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

async function createStyleFile(stylesPath, bundlePath) {
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
  styles.forEach(value => file.write(`${value}`));
  file.end();
}

function copyDirectory(sourcePath, destinationPath) {
  fsp.readdir(sourcePath, {withFileTypes: true})
    .then(objs => {
      for (let obj of objs) {
        if(obj.isFile()) {

          const file1 = path.resolve(sourcePath, obj.name);
          const file2 = path.resolve(destinationPath, obj.name);

          fs.copyFile(file1, file2, (err) => {
            if (err) {
              console.log("An error occurred:", err);
            }
            else {
              console.log(`File ${obj.name} has been copied`);
            }
          });

        }
      }
    })
    .catch(err => {
      console.log(err)
    })
}

async function main() {
  const distDir = path.resolve(__dirname, 'project-dist');
  createDirectory(distDir);

  const templateStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8');
  const template = await readableToString(templateStream);
  //console.log(template);

  const articlesStream = fs.createReadStream(path.resolve(__dirname, 'components', 'articles.html'), 'utf-8');
  const articles = await readableToString(articlesStream);

  const headerStream = fs.createReadStream(path.resolve(__dirname, 'components', 'header.html'), 'utf-8');
  const header = await readableToString(headerStream);

  const footerStream = fs.createReadStream(path.resolve(__dirname, 'components', 'footer.html'), 'utf-8');
  const footer = await readableToString(footerStream);

  let newHtml = template.replace('{{header}}', header)
    .replace('{{articles}}', articles)
    .replace('{{footer}}', footer);

  const aboutTemplate = "{{about}}";
  if(template.includes(aboutTemplate)) {
    const aboutStream = fs.createReadStream(path.resolve(__dirname, 'components', 'about.html'), 'utf-8');
    const about = await readableToString(aboutStream);
    newHtml = newHtml.replace('{{about}}', about);
  }

  var file = fs.createWriteStream(path.resolve(distDir, 'index.html'));
  file.on('error', function(err) { console.log(err) });
  file.write(newHtml);
  file.end();

  const stylesDir = path.resolve(__dirname, 'styles');
  const distStyle = path.resolve(__dirname, 'project-dist', 'style.css');
  createStyleFile(stylesDir, distStyle);

  createDirectory(path.resolve(__dirname, 'project-dist', 'assets'));
  createDirectory(path.resolve(__dirname, 'project-dist', 'assets', 'fonts'));
  createDirectory(path.resolve(__dirname, 'project-dist', 'assets', 'img'));
  createDirectory(path.resolve(__dirname, 'project-dist', 'assets', 'svg'));

  copyDirectory(path.resolve(__dirname, 'assets', 'fonts'), path.resolve(__dirname, 'project-dist', 'assets', 'fonts'));
  copyDirectory(path.resolve(__dirname, 'assets', 'img'), path.resolve(__dirname, 'project-dist', 'assets', 'img'));
  copyDirectory(path.resolve(__dirname, 'assets', 'svg'), path.resolve(__dirname, 'project-dist', 'assets', 'svg'));

}

main();


