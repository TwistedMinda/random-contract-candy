
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import configs, { ConfigKey } from './config'
import { getCandy } from "./internal";

export const getCandyContract = (type: ConfigKey, owner: HardhatEthersSigner) =>
  getCandy(configs[type]?.candy?.address ?? '', owner)
