const path = require('path');
const fs = require("fs");
const fsp = require("fs/promises");


function createDirectory(directoryPath) {
  fs.mkdir(directoryPath, { recursive: true }, (err) => {
    if (err) {
      console.log("Error occurred in creating new directory", err);
      return;
    }
    console.log("New directory created successfully");
  });
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

function clearDirectory(sourcePath, destinationPath) {
  fsp.readdir(destinationPath, {withFileTypes: true})
    .then(objs => {
      for (let obj of objs) {
        if(obj.isFile()) {

          const file1 = path.resolve(sourcePath, obj.name);
          const file2 = path.resolve(destinationPath, obj.name);

          fs.access(file1, async function (error) {
            if (error) {
              await fsp.unlink(file2);
              console.log(`${file2} has been removed successfully`);
            }
          });

        }
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const dir1 = path.resolve(__dirname, 'files');
const dir2 = path.resolve(__dirname, 'files-copy');

createDirectory(dir2);
copyDirectory(dir1, dir2);
clearDirectory(dir1, dir2);



