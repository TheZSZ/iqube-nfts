require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "zkEVM",
  networks: {
    hardhat: {},
    zkEVM: {
      url: process.env.zkEVM_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
