import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers" 
import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { deployConsumer } from "../artifacts/contracts/src/tools";

describe("Lock", function () {
  let rollId: number = 0
  const captureRollId = (value: any) => {
    rollId = value;
    console.log('found Roll', rollId)
    return true;
  };

  it("Generate number", async function () {
    const [owner] = await ethers.getSigners()
    const network = 'sepolia'

    const lock = await deployConsumer(network)
    
    const tx = await lock.requestNumber()
    await expect(tx.wait())
      .to.emit(lock, "RequestedNumber")
      .withArgs(captureRollId)
    
    await new Promise(async (resolve, reject) => {
      lock.once(
        'ReceivedNumber',
        async (id, res) => {
          try {
            console.log('result', id, res)
            resolve(true)
          } catch (e) {
            reject(e)
          }
        }
      )
    })
  })
})
