# Introduction

We've been there, we need to prototype some project for fun, and there we go, we need to setup a Chainlink VRF oracle.
This projects breaks it down to 2 steps:

## Setup Pedeployed Oracle

- Get LINK tokens in your wallet
- Go to : https://random-contract-candy.io
- Fill-in:
  - Choose your passowrd
  - Send LINK tokens (20 is usually enough)

## Implement the contract

### Install the contract
`npm install @twisted/random-contract-candy`

### Create your implementati

```
import '@twisted/random-contract-candy'

import MyRandomContract is RandomContractCandy {
  password: string

  constructor(String password) {
    this.password = password;
  }

  requestNumber(int min, int max) {
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
  MyRandomContract('PasswordYouHadChosen')
})
```