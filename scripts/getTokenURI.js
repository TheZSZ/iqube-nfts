// Get the token URI of a specific token ID from the PolygonNFT contract
require("dotenv").config();
const hre = require("hardhat");

// show usage
function showUsage() {
    console.log('Usage: node scripts/getTokenURI.js <tokenId>');
}

// check command-line arguments
if (process.argv.length !== 3) {
    console.error('Error: Incorrect number of arguments.');
    showUsage();
    process.exit(1);
}

const tokenId = process.argv[2];
console.log(tokenId);

async function main() {
    const contractAddress = process.env.NFT_MINTING_CONTRACT_ADDRESS; // contract address

    const PolygonNFT = await hre.ethers.getContractFactory("PolygonNFT");
    const polygonNFT = PolygonNFT.attach(contractAddress);

    try {
        let tokenURI = await polygonNFT.tokenURI(tokenId);
        console.log("Token URI:", tokenURI);
        tokenURI = tokenURI.replace("ipfs://", "");
        console.log(`View the token metadata at: https://${tokenURI}.ipfs.w3s.link/`);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
