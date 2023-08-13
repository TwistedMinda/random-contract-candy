// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

interface Receiver {
	function receivedNumber(uint _resultId, uint _number) external;
}

contract RandomContractCandy is VRFConsumerBaseV2, ConfirmedOwner {
  VRFCoordinatorV2Interface coordinator;
  uint32 public callbackGasLimit = 100000;
  uint16 requestConfirmations = 3;
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
		uint requestId = coordinator.requestRandomWords(
      keyHash,
      subId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );
    emit RequestStarted(requestId);
    receivers[requestId] = msg.sender;
    return requestId;
  }

  function fulfillRandomWords(
    uint256 _requestId,
    uint256[] memory _randomWords
  ) virtual internal override {
    emit RequestEnded(_requestId, _randomWords[0]);
    Receiver receiver = Receiver(receivers[_requestId]);
    receiver.receivedNumber(_requestId, _randomWords[0]);
  }
}
