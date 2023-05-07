const fs = require('fs');
const path = require('path');

const rStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let content = '';

rStream.on('data', chunk => content += chunk);
rStream.on('end', () => console.log(content));
rStream.on('err', err => console.log('error', err.message));
