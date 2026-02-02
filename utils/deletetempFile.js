import fs from 'fs';

export const deleteTempFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting temp file: ${filePath}`, err);
        } else {
            console.log(`Temp file deleted: ${filePath}`);
        }
    });
}
