// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "./src/v0.8/RandomContractCandy.sol";
import "hardhat/console.sol";

contract Lock is Receiver {
    event RequestedNumber(uint _resultId);
    event ReceivedNumber(uint _resultId, uint _number);
    SepoliaRandomContractCandy randomizer;

    constructor(SepoliaRandomContractCandy _randomizer) {
        randomizer = _randomizer;
    }

    function requestNumber() public returns (uint) {
        uint id = randomizer.requestNumber();
        emit RequestedNumber(id);
        return id;
    }

    function receivedNumber(uint _resultId, uint _number) public {
        emit ReceivedNumber(_resultId, _number);
        console.log("Received number: ", _resultId, _number);
    }
}
