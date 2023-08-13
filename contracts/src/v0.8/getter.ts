
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { RandomContractCandy, SepoliaRandomContractCandy } from "../../../typechain-types";

import VRF_COORDINATOR_ABI from '@chainlink/contracts/abi/v0.8/VRFCoordinatorV2.json';
import configs, { ConfigKey } from './config'

const ABI: any = VRF_COORDINATOR_ABI
const create = (address: string, owner: HardhatEthersSigner) => 
  new ethers.Contract(
    address,
    ABI,
    owner
) as unknown as RandomContractCandy;

export const getCandyContract = (type: ConfigKey, owner: HardhatEthersSigner) =>
  create(configs[type]?.candy?.address ?? '', owner)

export const createCandyContract = async (type: ConfigKey, owner: HardhatEthersSigner) => {
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