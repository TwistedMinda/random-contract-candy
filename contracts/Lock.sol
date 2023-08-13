// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "./src/v0.8/RandomContractCandy.sol";

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
    uint dice = (_number % 6) + 1; // Reduce as dice value (1 to 6)
    emit ReceivedNumber(_resultId, dice);
  }
}
