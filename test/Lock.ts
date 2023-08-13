import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import networkConfig from '../contracts/src/v0.8/config'
import VRF_COORDINATOR_ABI from '@chainlink/contracts/abi/v0.8/VRFCoordinatorV2.json';
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const request = (lock: any, account: HardhatEthersSigner) =>
  lock.connect(account).requestNumber({
    from: account.address,
  });

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners()
    const config = networkConfig.sepolia

    // Randomizer (Me)
    console.log('⚙️A"');
    const Randomizer = await ethers.getContractFactory("SepoliaRandomContractCandy");
    console.log('⚙️ B"');
    const randomizer = await Randomizer.deploy("hello")
    console.log('⚙️ Deploying "Randomizer"');
    await randomizer.waitForDeployment()
    console.log('🚀 Deployed "Randomizer": ', await randomizer.getAddress());

    // Lock (Customer)
    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(randomizer)
    console.log('⚙️ Deploying "Lock"');
    await lock.waitForDeployment()
    console.log('🚀 Deployed "Lock": ', await lock.getAddress());

    // Add consumer
    const coordinator = new ethers.Contract(
      config.vrfCoordinator,
      VRF_COORDINATOR_ABI,
      owner
    );
    await coordinator.addConsumer(config.subscriptionId, await randomizer.getAddress());
    console.log('🚀 Added Consumer "Randomizer"');
   
    return { lock, randomizer, coordinator, owner, otherAccount };
  }

  let rollId: number = 0
  const captureRollId = (value: any) => {
    rollId = value;
    console.log('found Roll', rollId)
    return true;
  };

  describe("Deployment", function () {
    it("Should generate numbers", async function () {
      const { lock, owner, randomizer } = await deploy();

      const txSend = await request(lock, owner)
      await expect(txSend.wait())
        .to.emit(lock, "RequestedNumber")
        .withArgs(captureRollId)

      await new Promise(async (resolve, reject) => {
        lock.once(
          'ReceivedNumber',
          async (id, res) => {
            try {
              console.log('result', id, res)
              resolve(true);
            } catch (e) {
              reject(e);
            }
          }
        );
      });
    });
  });
});
