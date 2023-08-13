import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.RPC_URL ?? '',
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY ?? ''],
    }
  },
  mocha: {
    timeout: 100000000
  },
};

export default config;
