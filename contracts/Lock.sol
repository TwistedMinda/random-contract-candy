// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "./src/v0.8/RandomContractCandy.sol";
import "hardhat/console.sol";

contract Lock is SepoliaRandomContractCandy {
    
    constructor(string memory _password) SepoliaRandomContractCandy(_password) {}

    function fulfillRandomWords(
        uint _requestId,
        uint256[] memory _randomWords
    ) virtual internal override {
        emit RequestEnded(_requestId, _randomWords[0]);
        uint res = (_randomWords[0] % 6) + 1;
        console.log("receivedNumber", _requestId, res);
    }
}
