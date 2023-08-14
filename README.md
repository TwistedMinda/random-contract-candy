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
import "@twisted/random-contract-candy/src/v0.8/RandomCandyContract.sol";

contract Lock is RandomCandyInterface {
  event RequestedNumber(uint _resultId);
  event ReceivedNumber(uint _resultId, uint _number);
  RandomCandyContract randomizer;

  constructor(RandomCandyContract _randomizer) {
    randomizer = _randomizer;
  }

  function requestNumber() public returns (uint) {
    uint id = randomizer.requestNumber();
    emit RequestedNumber(id);
    return id;
  }

  function receivedNumber(uint _resultId, uint _number) public {
    uint dice = (_number % 6) + 1; // Reduce as dice value (1 to 6)
    emit ReceivedNumber(_resultId, dice);
  }
}
```

### Deploy your contract

Supported networks: `sepolia`

```ts
import { getCandyContract } from '@twisted/random-contract-candy/src/v0.8/getter'

const network = 'sepolia'

const deployContract = async () => {
  const [owner] = await ethers.getSigners()

  // Retrieve existing Randomizer
  const randomizer = getCandyContract(network, owner)

  // Deploy your contract
  const Contract = await ethers.getContractFactory("Contract")
  const contract = await Contract.deploy(randomizer)
  await contract.waitForDeployment()

  // Your wallet must have at least 1 LINK
  await fundCandyContract(
    network,
    randomizer,
    1,
    await contract.getAddress() // Authorized to use the funds
  )
  
  return contract
}

async function main () {
  await deployContract()
}
```

### Test your contract

```ts
it("Generate number", async function () {
  const contract = await deployContract()
  
  // Request a random number
  const tx = await contract.requestNumber()

  // Verify "RequestedNumber" was emitted
  await expect(tx.wait())
    .to.emit(contract, "RequestedNumber")

  // Wait for "ReceivedNumber" to be emitted
  // ...care about timeout (eg. need more than 100 seconds on Sepolia)
  await new Promise(async (resolve, reject) => {
    contract.once(
      'ReceivedNumber',
      async (id, res) => {
        console.log('result', id, res)
        resolve(true)
      }
    )
  })
})
```
