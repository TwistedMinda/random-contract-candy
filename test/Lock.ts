import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import networkConfig from '../contracts/src/v0.8/config'
import VRF_COORDINATOR_ABI from '@chainlink/contracts/abi/v0.8/VRFCoordinatorV2.json';

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners()
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
    return { lock, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should generate numbers", async function () {
      const { lock, owner } = await deploy();
      const addr = await lock.getAddress()

      try {
        const promise = lock.connect(owner).requestNumber()
        expect(promise).to.emit(lock, 'RequestStarted')
        console.log('🚀 Number found: ', await promise);
      } catch (err) {
        console.log(err)
      }
    });
  });
});
