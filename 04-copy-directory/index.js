const promises = require('fs/promises');
const path = require('path');


async function mkDir() {
    try {

        await promises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

    } catch (err) {
        console.log(err);
    }
}

async function copyDir() {
    try {

        const copyFiles = await promises.readdir(path.join(__dirname, 'files-copy'));
        for (let file of copyFiles) {
            await promises.unlink(path.join(__dirname, 'files-copy', `${file}`),
                { recursive: true, force: true });
        }

        const files = await promises.readdir(path.join(__dirname, 'files'));
        for (let file of files) {
            await promises.copyFile(path.join(__dirname, 'files', `${file}`), path.join(__dirname, 'files-copy', `${file}`));
        }

    } catch (err) {
        console.log(err);
    }
}

mkDir();
copyDir();
