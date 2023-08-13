import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers" 
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { deployCandy, deployConsumer } from "../artifacts/contracts/src/tools";

describe("Lock", function () {
  let rollId: number = 0
  const captureRollId = (value: any) => {
    rollId = value;
    console.log('found Roll', rollId)
    return true;
  };

  let candyAddress = ''

  it("Deploy randomizer", async function () {
    const randomizer = await deployCandy('sepolia');
    console.log('> Adding funds')
    await randomizer.addFunds('MyPassword', 20)
    console.log('> Done adding funds')
    candyAddress = await randomizer.getAddress()
  });

  it("Generate number", async function () {
    const lock = await deployConsumer(candyAddress)
    
    const tx = await lock.requestNumber()
    await expect(tx.wait())
      .to.emit(lock, "RequestedNumber")
      .withArgs(captureRollId)
    
    await new Promise(async (resolve, reject) => {
      lock.once(
        'ReceivedNumber',
        async (id, res) => {
          console.log('result', id, res)
          resolve(true)
        }
      )
    })
  })
})
