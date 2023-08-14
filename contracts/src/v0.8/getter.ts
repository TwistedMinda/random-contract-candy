
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import configs, { CandyContractConfig, ConfigKey } from './config'
import { getCandy } from "./internal";
import { RandomCandyContract } from "../../../typechain-types";
import { ethers } from "hardhat";

import LINK_TOKEN_ABI from '@chainlink/contracts/abi/v0.8/LinkTokenInterface.json';

export const getCandyContract = (type: ConfigKey, owner: HardhatEthersSigner) =>
  getCandy(configs[type]?.candy?.address ?? '', owner)

export const fundCandyContract = async (
  config: CandyContractConfig,
  target: RandomCandyContract, 
  amount: number,
  whitelistedAddress: string
) => {
  const [owner] = await ethers.getSigners();
  
  console.log('> Funding candy...')

  const chain = config.chain;
  const linkAddress = config?.chainlink?.linkToken ?? configs[chain]?.chainlink?.linkToken;
  if (!linkAddress)
    throw new Error('No link token address found for ' + chain)

  const linkToken = new ethers.Contract(linkAddress, LINK_TOKEN_ABI, owner);
  const decimals = await linkToken.decimals();

  const amountValue = ethers.parseUnits(amount.toString(), decimals)
  const amountTxt = ethers.formatUnits(amountValue, decimals)
  console.log('> Amount:', amountValue)
  await linkToken.approve(target, amountValue)
  console.log('> Approved:', amountTxt, 'LINK')

  const res = await linkToken.balanceOf(owner.address)
  const balance = ethers.formatUnits(res, decimals)
  console.log('> Balance:', balance, 'LINK')
  
  const addFundsTransaction = await target.addFunds(amountValue, whitelistedAddress)
  await addFundsTransaction.wait()

  console.log('> Candy funded')
}