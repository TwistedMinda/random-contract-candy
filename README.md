## Chainlink VRF Abstraction -- Shared Oracle

### Introduction

Simplified chainlink's random numbers generation:

- 🤑 Get LINK tokens in your wallet (https://faucets.chain.link/) 
- 🎯 Retrieve the existing Shared Oracle
- 💰 Fund it & Authorize your own contract
- 🚀 You're all set

### Install the contract

`yarn add @twisted/random-contract-candy`

### Use the candy in your contracts

```solidity
import "@twisted/random-contract-candy/src/v0.8/RandomCandyContract.sol";

contract Example is RandomCandyInterface {
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

This is the big step:
- Call `getCandyContract` to retrieve the Shared Oracle.
- Deploy your contract and attach the Shared Oracle
- (optional) Call `fundCandyContract` to fund the Shared Oracle & authorize your contract

Supported networks: `sepolia`

```ts
import {
  getCandyContract,
  fundCandyContract
} from '@twisted/random-contract-candy/src/v0.8/getter'

const network = 'sepolia'

const deployContract = async () => {
  const [owner] = await ethers.getSigners()

  // Retrieve existing Randomizer
  const candy = getCandyContract(network, owner)

  // Deploy your contract
  const Example = await ethers.getContractFactory("Example")
  const contract = await Example.deploy(candy)
  await contract.waitForDeployment()

  // Your wallet must have at least 1 LINK
  await fundCandyContract(
    network,
    candy,
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

Don't forget to test your contract:

```ts
it("Generate number", async function () {
  const contract = await deployContract()
  
  // Request a random number 
  // ...each call will cost a fix 0.5 LINK
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
