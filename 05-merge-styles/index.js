const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');

const outStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

async function mkCSS() {
    try {
        const files = await promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
        for (let file of files) {

            if (file.isFile() && path.extname(file.name) == '.css') {

                const rStream = fs.createReadStream(path.join(__dirname, 'styles', `${file.name}`), 'utf-8');
                rStream.on('data', (chunk) => {
                    outStream.write(chunk + '\n');
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
}
mkCSS();