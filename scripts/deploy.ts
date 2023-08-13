import { ethers } from "hardhat";
import { deployCandy } from "../artifacts/contracts/src/tools";

async function main() {
  const network = 'sepolia'
  const randomizer = await deployCandy(network)
  const address = await randomizer.getAddress()
  console.log('> Now add address in config: ', address, 'for network', network)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
