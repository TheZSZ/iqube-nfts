// deploy the nft smart contract

const hre = require("hardhat");

async function main() {
    const signers = await hre.ethers.getSigners();
    console.log("Available signers:", signers);

    const [deployer] = signers;
    console.log("Deploying contracts with the account:", deployer.address);

    const PolygonNFT = await hre.ethers.getContractFactory("PolygonNFT");
    const polygonNFT = await PolygonNFT.deploy(deployer.address);       // Pass the deployer address as the initial owner
    await polygonNFT.deployed();                                        // await the deployment

    console.log(`PolygonNFT deployed to https://cardano-zkevm.polygonscan.com/address/${polygonNFT.address}`);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
