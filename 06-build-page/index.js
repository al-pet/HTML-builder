const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');


async function mkDir() {
    try {
        await promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    } catch (err) {
        console.log(err);
    }
}


const outStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

async function writeCSS() {
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


async function copyFolder(src, srcInProject) {
    const foldersInAssets = await promises.readdir(src, { withFileTypes: true });

    await promises.rm(srcInProject, { force: true, recursive: true });
    await promises.mkdir(srcInProject, { recursive: true });

    for (let oneFolderInAssets of foldersInAssets) {
        const srcInProjectPath = path.join(srcInProject, oneFolderInAssets.name);

        await promises.mkdir(srcInProjectPath);
    }
}


async function copyAssets() {
    try {
        let assetsDir = await promises.readdir(path.join(__dirname, 'assets'));

        for (let folders of assetsDir) {
            let folderFiles = await promises.readdir(path.join(__dirname, 'assets', folders), { force: true });

            for (let file of folderFiles) {
                await promises.copyFile(path.join(__dirname, 'assets', folders, file), path.join(__dirname, 'project-dist', 'assets', folders, file));
            }
        }
    } catch (err) {
        console.error(err);
    }
}


async function createHtmlFile() {
    try {
        const htmlFiles = await promises.readdir(path.join(__dirname, 'components'), { force: true });

        const readStreamIndx = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

        let resultChunk = '';
        readStreamIndx.on('data', (chunk) => {
            resultChunk += chunk;
        });

        readStreamIndx.on('end', () => {

            for (let file of htmlFiles) {
                if (path.extname(file) == '.html') {
                    const htmlFileName = file.slice(0, file.length - 5);

                    if (resultChunk.includes(`${htmlFileName}`)) {
                        const readStreamHtmlFile = fs.createReadStream(path.join(__dirname, 'components', file), 'utf-8');
                        let string = '';

                        readStreamHtmlFile.on('data', (data) => {
                            string = string + data;
                        });

                        readStreamHtmlFile.on('end', () => {
                            resultChunk = resultChunk.replace(`{{${htmlFileName}}}`, string);

                            promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), resultChunk, 'utf-8');
                        });
                    }
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
}

mkDir();
writeCSS();
copyFolder(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets')).then(copyAssets);
createHtmlFile();