require("dotenv").config();
const hre = require("hardhat");
// const fs = require('fs');

// show usage
function showUsage() {
    console.log('Usage: node scripts/mintQube.js <metaQubeCID> <secretKey>');
}

// check command-line arguments
if (process.argv.length !== 4) {
    console.error('Error: Incorrect number of arguments.');
    showUsage();
    process.exit(1);
}

const metaQubeCID = process.argv[2];
const secretKey = process.argv[3];

// connect to the Polygon zkEVM network
const provider = new hre.ethers.JsonRpcProvider(process.env.zkEVM_ENDPOINT);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new hre.ethers.Wallet(privateKey, provider);

// set up the contract
const polygonNFTAddress = process.env.NFT_MINTING_CONTRACT_ADDRESS;
const polygonNFTABI = [
  "function mintQube(address to, string memory uri, string memory encryptionKey) public",
  "function tokenURI(uint256 tokenId) view returns (string memory)",
  "function getEncryptionKey(uint256 tokenId) view returns (string memory)"
];
const polygonNFT = new hre.ethers.Contract(polygonNFTAddress, polygonNFTABI, wallet);

// async function uploadMetaQube() {
//     // For simulation purposes, return the provided CID
//     console.log(`metaQube JSON uploaded to IPFS with CID: ${metaQubeCID}`);
//     return metaQubeCID;
// }

// Mint NFT with metaQube data
async function mintQube() {
    try {
        // const ipfsURI = await uploadMetaQube();
        const ipfsURI = metaQubeCID;
        const txn = await polygonNFT.mintQube(wallet.address, ipfsURI, secretKey);
        await txn.wait();
        console.log("NFT Minted:", txn);
        console.log(`Transaction hash: https://cardona-zkevm.polygonscan.com/tx/${txn.hash}`);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

mintQube()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
