import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers" 
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { deployCandy, deployConsumer } from "../artifacts/contracts/src/tools";

import LINK_TOKEN_ABI from '@chainlink/contracts/abi/v0.8/LinkTokenInterface.json';
import { RandomCandyContract } from "../typechain-types";
import { fundCandyContract } from "../contracts/src/v0.8/getter";

describe("Lock", function () {
  let rollId: number = 0
  const captureRollId = (value: any) => {
    rollId = value;
    console.log('found Roll', rollId)
    return true;
  };

  let randomizer: RandomCandyContract | undefined
  let candyAddress = ''

  it("Deploy randomizer", async function () {
    const _randomizer = await deployCandy('sepolia');
    candyAddress = await _randomizer.getAddress()
    randomizer = _randomizer
  });

  it("Generate number", async function () {
    if (!candyAddress || !randomizer)
      return;
    const lock = await deployConsumer(candyAddress)
    
    try {
      await fundCandyContract(
        'sepolia',
        randomizer,
        0.5,
        await lock.getAddress()
      )
    } catch (err) {
      console.log('❌ Failed to fund')
    }
    
    const generateNumberTransaction = await lock.requestNumber()
    await expect(generateNumberTransaction.wait())
      .to.emit(lock, "RequestedNumber")
      .withArgs(captureRollId)
    
    await new Promise(async (resolve) => {
      lock.once('ReceivedNumber', async (id, res) => {
        console.log('result', id, res)
        resolve(true)
      })
    })
  })
})
