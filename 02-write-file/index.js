const fs = require('fs');
const path = require('path');

const { stdout, stdin } = process;

stdout.write('Input your text: ');

const outStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdin.on('data', chunk => {
  if (chunk.toString() === 'exit\r\n') {
    process.exit();
  }
  outStream.write(chunk);
});

process.on('SIGINT', () => {
  process.exit();
});


stdin.on('error', err => console.log('error', err.message));
process.on('exit', () => console.log('\nThank You'));