import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { addCandyConsumer, createCandyContract } from "../contracts/src/v0.8/getter";
import { deployCandy } from "../artifacts/contracts/src/tools";

describe("Randomizer", function () {
  return;
  let rollId: number = 0
  const captureRollId = (value: any) => {
    rollId = value;
    console.log('found Roll', rollId)
    return true;
  };
  
  it("Deploy randomizer", async function () {
    const randomizer = await deployCandy('sepolia');

    const txSend = await randomizer.requestNumber()
    await expect(txSend.wait())
      .to.emit(randomizer, "RequestStarted")
      .withArgs(captureRollId)

    await new Promise(async (resolve, reject) => {
      randomizer.once(
        'RequestEnded',
        async (id, res) => {
          console.log('result', id, res)
          resolve(true);
        }
      );
    });
  });
});