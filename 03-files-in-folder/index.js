const fs = require('fs');
const path = require('path');
const promises = fs.promises;

promises.readdir(path.join(__dirname, 'secret-folder'), {
  withFileTypes: true
}).then(files => {
  files.forEach(file => {
    if (file.isFile()) {
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      const fileName = path.basename(filePath);
      const ext = path.extname(filePath);
      promises.stat(filePath).then(result => {
        console.log(`${fileName.replace(ext, '')} - ${ext.replace('.', '')} - ${Number(result.size / 1000)}kb`);
      });
    }
  });
});




