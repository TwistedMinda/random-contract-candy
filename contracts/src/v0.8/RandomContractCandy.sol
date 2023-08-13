// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
/*
interface Receiver {
	function receivedNumber(uint _resultId, uint _number) public {}
}
*/
import "hardhat/console.sol";

abstract contract RandomContractCandy is VRFConsumerBaseV2, ConfirmedOwner {
  VRFCoordinatorV2Interface coordinator;
  uint32 callbackGasLimit = 2500000;
  uint16 requestConfirmations = 1;
  uint32 numWords = 1;
	uint64 subId;
	bytes32 keyHash;
  string password;

	mapping (uint => address) receivers;
  event RequestStarted(uint _resultId);
  event RequestEnded(uint _resultId, uint _number);

	constructor(
		uint64 _subId,
		address coordinatorAddr,
		bytes32 _keyHash,
    string memory _password
  ) VRFConsumerBaseV2(coordinatorAddr) ConfirmedOwner(msg.sender) {
		coordinator = VRFCoordinatorV2Interface(coordinatorAddr);
		subId = _subId;
		keyHash = _keyHash;
    password = _password;
	}

	function requestNumber() public returns (uint) {
		// uint requestId = coordinator.requestRandomWords(
    //   keyHash,
    //   subId,
    //   requestConfirmations,
    //   callbackGasLimit,
    //   numWords
    // );
    emit RequestStarted(10);
    // return requestId;
    return 10;
  }

  function fulfillRandomWords(
    uint256 _requestId,
    uint256[] memory _randomWords
  ) virtual internal override {
    emit RequestEnded(_requestId, _randomWords[0]);
    //Receiver receiver = Receiver(receivers[requestId]);
    //receiver.receivedNumber(requestId, _randomWords[0]);
  }
}

contract SepoliaRandomContractCandy is RandomContractCandy {

  constructor (string memory _password) RandomContractCandy(
    4472,
    0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625,
    0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c,
    _password
  ) {}

}

contract FantomRandomContractCandy is RandomContractCandy {

  constructor (string memory _password) RandomContractCandy(
    141,
    0x5FbDB2315678afecb367f032d93F642f64180aa3,
    0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4,
    _password
  ) {}

}