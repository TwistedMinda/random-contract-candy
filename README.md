# Introduction

We've been there, we need to prototype some project for fun, and there we go, we need to setup a Chainlink VRF oracle.
This projects breaks it down to 2 steps:

## Setup Pedeployed Oracle

- Get LINK tokens in your wallet (https://faucets.chain.link/)
- Go to : https://random-contract-candy.io
- Fill-in:
  - Choose your passowrd
  - Choose the network (Sepolia, Mumbai...)
  - Send LINK tokens (20 is usually enough)

## Implement the contract

### Install the contract

`yarn add @twisted/random-contract-candy`

### Create your implementati

```solidity
import "@twisted/random-contract-candy/contracts/RandomContractCandy.sol"

import MyConsumer is Receiver {

  requestNumber(int _min_, int max) {
    this.requestNumber(min, max);
  }

  onNumberReceived(int received) {
    log('yahoo', received)
  }
}

```

### Deploy the contract 

```ts
task('deploy', 'Deployment', () => {
  const = new MyConsumer('PasswordYouHadChosen')
})
```

Note: Of course, use Environment Variables instead of clear text