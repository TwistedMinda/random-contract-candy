import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { addCandyConsumer, createCandyContract } from "../contracts/src/v0.8/getter";
import { deployCandy } from "../artifacts/contracts/src/tools";

const network = 'sepolia'

const request = (lock: any, account: HardhatEthersSigner) =>
  lock.connect(account).requestNumber({
    from: account.address,
  });

describe("Randomizer", function () {
  return;
  let rollId: number = 0
  const captureRollId = (value: any) => {
    rollId = value;
    console.log('found Roll', rollId)
    return true;
  };
  
  it("Deploy randomizer", async function () {
    const [owner] = await ethers.getSigners()
    const randomizer = await deployCandy(network);

    const txSend = await request(randomizer, owner)
    await expect(txSend.wait())
      .to.emit(randomizer, "RequestStarted")
      .withArgs(captureRollId)

    await new Promise(async (resolve, reject) => {
      randomizer.once(
        'RequestEnded',
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