const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.resolve(__dirname, 'out.txt');
const outputFile = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: outputFile
});

console.log(`==========
Notes:
exit - enter this for exit.
Ctrl+C - type this also for exit, but note about bug in Git Bash ver 2.35.1-2.35.4. 
============
Please enter some text:`);

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'exit':
      rl.close();
      break;
    default:
      outputFile.write(line + '\n');
      break;
  }
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});

// On Windows can be some problems with handling Ctrl+C
// You have to listen for a SIGINT event
// https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js/14861513#14861513
if (process.platform === "win32") {
  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}
process.on("SIGINT", function () {
  console.log('Bye!');
  process.exit();
});
