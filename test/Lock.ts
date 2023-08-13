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

  let rollId: number = 0
  const captureRollId = (value: any) => {
    rollId = value;
    console.log('found Roll', rollId)
    return true;
  };

  describe("Deployment", function () {
    it("Should generate numbers", async function () {
      const { lock, owner } = await deploy();
      const addr = await lock.getAddress()

      await lock.connect(owner).requestNumber()
      /*
      await new Promise((resolve, reject) => {
        lock.once(
          'RequestEnded',
          (_id: number, res: number) => {
            console.log('_id', _id, res)
            try {
              resolve(true);
            } catch (e) {
              reject(e);
            }
          }
        );
        console.log('requesting number')
        expect(lock.connect(owner).requestNumber())
          .to.emit(lock, 'RequestStarted')
          .withArgs(captureRollId);
      });
      */
    });
  });
});
