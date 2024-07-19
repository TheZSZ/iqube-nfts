// get the secret key for the encrypted file. Only the owner of the NFT should be able to access the secret key.
require("dotenv").config();
const hre = require("hardhat");

// to show usage
function showUsage() {
    console.log('Usage: node scripts/getSecretKey.js <tokenId>');
}

// check command-line arguments
if (process.argv.length !== 3) {
    console.error('Error: Incorrect number of arguments.');
    showUsage();
    process.exit(1);
}

const tokenId = process.argv[2];

async function main() {
    const contractAddress = process.env.NFT_MINTING_CONTRACT_ADDRESS; // contract address

    const PolygonNFT = await hre.ethers.getContractFactory("PolygonNFT");
    const polygonNFT = PolygonNFT.attach(contractAddress);

    try {
        const secretKey = await polygonNFT.getEncryptionKey(tokenId);
        console.log("Secret Key:", secretKey);
    } catch (err) {
        if (err.message.includes("Caller is not the owner")) {
            console.error("Error: You don't own this NFT. Unable to get decryption key.");
        } else {
            console.error('Error:', err.message);
        }
        process.exit(1);
    }
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
