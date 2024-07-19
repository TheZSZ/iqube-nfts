// Encrypts the contents of a file using AES-256-CBC encryption

const crypto = require('crypto');
const fs = require('fs');

// Function to encrypt data
function encryptData(data, secretKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to show usage
function showUsage() {
    console.log('Usage: node encrypt.js <filename>');
}

// Check command-line arguments
if (process.argv.length !== 3) {
    console.error('Error: Incorrect number of arguments.');
    showUsage();
    process.exit(1);
}

const filename = process.argv[2];

try {
    const data = fs.readFileSync(filename, 'utf8');             // Read the specified file
    const secretKey = crypto.randomBytes(32);                   // Generate a secret key (ensure to store this securely)
    const encryptedData = encryptData(data, secretKey);         // Encrypt the data

    // Save the encrypted data to a new file with the prefix 'encrypted-'
    const outputFilename = `encrypted-${filename}`;
    fs.writeFileSync(outputFilename, encryptedData);
    console.log(`HTML file encrypted and saved as ${outputFilename}`);
    console.log('Secret Key (hex):', secretKey.toString('hex'));
} catch (err) {
    if (err.code === 'ENOENT') {
        console.error('Error: File not found.');
    } else {
        console.error('Error:', err.message);
    }
    showUsage();
    process.exit(1);
}
