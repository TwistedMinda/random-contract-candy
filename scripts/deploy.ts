import { ethers } from "hardhat";
import { deployCandy } from "../artifacts/contracts/src/tools";

async function main() {
  await deployCandy('sepolia')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
