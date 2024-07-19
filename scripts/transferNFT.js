require("dotenv").config();
const hre = require("hardhat");

async function main() {
    const tokenId = process.argv[2];
    const recipient = process.argv[3];

    if (!tokenId || !recipient) {
        console.error("Usage: node transferNFT.js <tokenId> <recipient>");
        process.exit(1);
    }

    const contractAddress = process.env.NFT_MINTING_CONTRACT_ADDRESS;
    const provider = new hre.ethers.JsonRpcProvider(process.env.zkEVM_ENDPOINT);
    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const abi = [
        "function transferQube(address to, uint256 tokenId) external"
    ];
    const nftContract = new hre.ethers.Contract(contractAddress, abi, wallet);

    // const from = wallet.address;

    try {
        // const tx = await nftContract.safeTransferFrom(from, recipient, tokenId);
        const tx = await nftContract.transferQube(recipient, tokenId);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log(`NFT with tokenId ${tokenId} transferred to ${recipient}`);
    } catch (error) {
        console.error("Error transferring NFT:", error);
    }
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
