### Introduction

We've been there, we need to prototype some project for fun, and there we go, we need to setup a Chainlink VRF oracle.
This projects breaks it down to 2 steps:

# Step 1: Feed the Shared Oracle

- Get LINK tokens in your wallet (https://faucets.chain.link/)
- Go to : https://random-contract-candy.io
- Fill-in:
  - Choose your passowrd
  - Choose the network (Sepolia, Mumbai...)
  - Send LINK tokens (20 is usually enough)

# Step 2: Implement the candy contract

### Install the contract

`yarn add @twisted/random-contract-candy`

### Use the candy in your contracts

```solidity
import "@twisted/random-contract-candy/src/v0.8/RandomContractCandy.sol";

contract Lock is Receiver {
  event RequestedNumber(uint _resultId);
  event ReceivedNumber(uint _resultId, uint _number);
  RandomContractCandy randomizer;

  constructor(RandomContractCandy _randomizer) {
    randomizer = _randomizer;
  }

  function requestNumber() public returns (uint) {
    uint id = randomizer.requestNumber();
    emit RequestedNumber(id);
    return id;
  }

  function receivedNumber(uint _resultId, uint _number) public {
    emit ReceivedNumber(_resultId, _number);
  }
}
```

### Deploy your contract

Supported networks: `sepolia`

```ts
async function main () {
  const [owner] = await ethers.getSigners()

  // Retrieve existing Randomizer
  const randomizer = getCandyContract('sepolia', owner)

  // Your contract
  const Contract = await ethers.getContractFactory("Contract")
  const contract = await Contract.deploy(randomizer)
  await contract.waitForDeployment()
}
```