import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers" 
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { deployCandy, deployConsumer } from "../artifacts/contracts/src/tools";

import LINK_TOKEN_ABI from '@chainlink/contracts/abi/v0.8/LinkTokenInterface.json';

describe("Lock", function () {
  let rollId: number = 0
  const captureRollId = (value: any) => {
    rollId = value;
    console.log('found Roll', rollId)
    return true;
  };

  let candyAddress = ''

  it("Deploy randomizer", async function () {
    const [owner] = await ethers.getSigners();
    const randomizer = await deployCandy('sepolia');
    console.log('> Adding funds')
    
    const linkAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789';
    const linkToken = new ethers.Contract(linkAddress, LINK_TOKEN_ABI, owner);
    const decimals = await linkToken.decimals();
    const amount = ethers.parseUnits("0.02", decimals)
    const amountTxt = ethers.formatUnits(amount, decimals)
    await linkToken.approve(randomizer, amount)
    console.log('> Approved:', amountTxt, 'LINK')

    const res = await linkToken.balanceOf(owner.address)
    const balance = ethers.formatUnits(res, decimals)
    console.log('> Balance:', balance, 'LINK')
    const tx = await randomizer.addFunds(amount)
    await tx.wait()

    console.log('> Done adding funds')
    candyAddress = await randomizer.getAddress()
  });

  it("Generate number", async function () {
    if (!candyAddress)
      return;
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
