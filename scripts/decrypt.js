// Decrypts a file using a secret key

const crypto = require('crypto');
const fs = require('fs');

// Function to decrypt data
function decryptData(encryptedData, secretKey) {
    const textParts = encryptedData.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// show usage
function showUsage() {
    console.log('Usage: node decrypt.js <encryptedFilename> <secretKey>');
}

// check command-line arguments
if (process.argv.length !== 4) {
    console.error('Error: Incorrect number of arguments.');
    showUsage();
    process.exit(1);
}

const encryptedFilename = process.argv[2];
const secretKey = process.argv[3];

try {
    const encryptedData = fs.readFileSync(encryptedFilename, 'utf8');
    const decryptedData = decryptData(encryptedData, secretKey);

    const outputFilename = `decrypted-${encryptedFilename}`;
    fs.writeFileSync(outputFilename, decryptedData);
    console.log(`Decrypted file saved as ${outputFilename}`);
} catch (err) {
    if (err.code === 'ENOENT') {
        console.error('Error: File not found.');
    } else {
        console.error('Error:', err.message);
    }
    showUsage();
    process.exit(1);
}
