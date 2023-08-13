import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.RPC_URL ?? '',
      chainId: 11155111,
      gas: 2100000,
      gasPrice: 8000000000,
      accounts: [process.env.PRIVATE_KEY ?? '']
    }
  }
};

export default config;
