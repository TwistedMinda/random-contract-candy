
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";

import VRF_COORDINATOR_ABI from '@chainlink/contracts/abi/v0.8/VRFCoordinatorV2.json';
import configs, { ConfigKey } from './config'
import { RandomContractCandy } from "../../../typechain-types";

const ABI: any = VRF_COORDINATOR_ABI
export const getCandy = (address: string, owner: HardhatEthersSigner) => 
  new ethers.Contract(
    address,
    ABI,
    owner
) as unknown as RandomContractCandy

export const createCandy = async (type: ConfigKey) => {
  const config = configs[type]
  const Randomizer = await ethers.getContractFactory("RandomContractCandy");
  return await Randomizer.deploy(
    config.candy.subscriptionId,
    config.chainlink.vrfCoordinator,
    config.chainlink.keyHash,
    "hello"
  )
}

export const addCandyConsumer = async (
  type: ConfigKey,
  address: string,
  owner: HardhatEthersSigner
) => {
  const config = configs[type]
  const coordinator = new ethers.Contract(
    config.chainlink.vrfCoordinator,
    VRF_COORDINATOR_ABI,
    owner
  );
  await coordinator.addConsumer(config.candy.subscriptionId, address);
  return coordinator
}