// Не обращайте внимание на комментарии, это мой конспект

// Поток чтения (Readable stream): https://github.com/rolling-scopes-school/tasks/blob/master/stage1/modules/node-materials/node/stream-readable.md

// Получение данных о файле: https://github.com/rolling-scopes-school/tasks/blob/master/stage1/modules/node-materials/node/module/path.md
//const path = require('path');
//console.log(path.dirname(__filename)); // C:\projects-rs-school\HTML-builder\01-read-file
//console.log(path.basename(__filename)); // index.js
//console.log(path.extname(__filename)) // .js - расширение файла
//console.log(path.parse(__filename)); // возвращает объект в котором указывается корень диска, имя папки, имя файла, расширение файла, имя файла без расширения:
//{
//  root: 'C:\\',
//  dir: 'C:\\projects-rs-school\\HTML-builder\\01-read-file',
//  base: 'index.js',
//  ext: '.js',
//  name: 'index'
//}
//console.log(path.resolve(__dirname, path.basename(__filename))); // C:\projects-rs-school\HTML-builder\01-read-file\index.js


// 1 способ - небольшой файл, использование toString()
// const fs = require('fs');
//const readableStream = fs.createReadStream('text.txt');
//readableStream.on('data', chunk => console.log(chunk.toString()));


// 2 способ - небольшой файл, с указанием utf-8
// const fs = require('fs');
// const readableStream = fs.createReadStream('text.txt', 'utf-8');
// readableStream.on('data', chunk => console.log(chunk));


// 3 способ - большой файл, вывод в консоль с помощью console.log()
//const path = require('path');
//const filepath = path.resolve(__dirname, 'text.txt');

//const fs = require('fs');
//const readableStream = fs.createReadStream(filepath, 'utf-8');

//let data = '';
//readableStream.on('data', chunk => data += chunk);
//readableStream.on('end', () => console.log('End', data));
//readableStream.on('error', error => console.log('Error', error.message));


// 4 способ - большой файл, вывод в поток вывода process.stdout
const path = require('path');
const filepath = path.resolve(__dirname, 'text.txt');

const fs = require('fs');
const readableStream = fs.createReadStream(filepath, 'utf-8');

const { stdout } = process;
let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data));
readableStream.on('error', error => console.log('Error', error.message));