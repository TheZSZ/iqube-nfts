// this uploads to IPFS using the web3.storage client
import * as Client from '@web3-storage/w3up-client';
import { filesFromPaths } from 'files-from-path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Function to show usage
function showUsage() {
    console.log('Usage: node upload.mjs <filename>');
}

// Check command-line arguments
if (process.argv.length !== 3) {
    console.error('Error: Incorrect number of arguments.');
    showUsage();
    process.exit(1);
}

const filename = process.argv[2];

// Function to upload file to IPFS
async function uploadFile(filepath) {
    try {
        if (!fs.existsSync(filepath)) {
            throw new Error('File not found.');
        }

        const client = await Client.create();

        // First time setup
        if (!Object.keys(client.accounts()).length) {
            // waits for you to click the link in your email to verify your identity
            const account = await client.login(process.env.EMAIL); // replace with your actual email
            // create a space for your uploads
            const space = await client.createSpace('Zee K');
            // save the space to the store, and set as "current"
            await space.save();
            // associate this space with your account
            await account.provision(space.did());
        }

        // Set the current space to 'Zee K'
        const spaces = await client.spaces();
        const space = spaces.find(s => s.name === 'Zee K');
        if (!space) {
            throw new Error(`Space 'Zee K' not found.`);
        }
        await client.setCurrentSpace(space.did());

        // Content-address your files
        const files = await filesFromPaths([filepath]);
        const root = await client.uploadDirectory(files);

        console.log('File uploaded to IPFS with CID:', root.toString());
        return root.toString();
    } catch (err) {
        console.error('Error:', err.message);
        showUsage();
        process.exit(1);
    }
}

// Upload file and get CID
uploadFile(filename).then((cid) => {
    console.log('File CID:', cid);
});
