const path = require('path');
const fs = require("fs");
const fsp = require("fs/promises");

const secretDir = path.resolve(__dirname, 'secret-folder');

fsp.readdir(secretDir, {withFileTypes: true})
  .then(objs => {
    for (let obj of objs) {
      if(obj.isFile()) {
        const name = path.parse(obj.name).name;
        const ext = path.extname(obj.name).split('.')[1];

        const filepath = path.resolve(__dirname, 'secret-folder', obj.name);
        let size = 0;
        fs.stat(filepath, (err, stats) => {
          size = stats.size;
          console.log(`${name} - ${ext} - ${formatBytes(size)}`);
        });
      }
    }
  })
  .catch(err => {
    console.log(err)
  })

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
