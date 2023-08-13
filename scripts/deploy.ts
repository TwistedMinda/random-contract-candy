import { ethers } from "hardhat";
import networkConfig from '../contracts/src/v0.8/config'
import VRF_COORDINATOR_ABI from '@chainlink/contracts/abi/v0.8/VRFCoordinatorV2.json';

async function main() {
  const [owner] = await ethers.getSigners()
  const config = networkConfig.sepolia

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy("hello")
  console.log('⚙️ Deploying "Lock"');
  await lock.waitForDeployment()
  console.log('🚀 Deployed "Lock": ', await lock.getAddress());

  // Add consumer
  const coordinator = new ethers.Contract(
    config.vrfCoordinator,
    VRF_COORDINATOR_ABI,
    owner
  );
  await coordinator.addConsumer(config.subscriptionId, await lock.getAddress());
  console.log('🚀 Added Consumer "Lock"');

  try {
    const res = await lock.requestNumber()
    console.log('🚀 Number found: ', res);
  } catch (err) {
    console.log(err)
  }
}

/*
async function setupRandomizer() {
  const config = networkConfig[4002]
  const [owner] = await ethers.getSigners()

  const RandomContractCandy = await ethers.getContractFactory('RandomContractCandy');
  const randomizer = await RandomContractCandy.deploy(
    config.subscriptionId,
    config.vrfCoordinator,
    config.keyHash,
    "ok"
  );
  await randomizer.waitForDeployment();
  console.log(`✅ Randomizer deployed`);

  // Add consumer
  const coordinator = new ethers.Contract(
    config.vrfCoordinator,
    VRF_COORDINATOR_ABI,
    owner
  );
  await coordinator.addConsumer(config.subscriptionId, randomizer.getAddress());
  console.log(`✅ Added consumer`);
  console.log('🚀 Randomizer: ', randomizer.getAddress());
}
*/

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
