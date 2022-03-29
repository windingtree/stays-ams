// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

import "hardhat/console.sol";


abstract contract StayEscrow {
  using Address for address payable;

  enum State {
    Checkin,
    Checkout,
    Closed
  }

  event Deposited(address indexed payee, uint256 weiAmount, bytes32 spaceId, uint256 tokenId);
  event Withdraw(address indexed payer, address indexed payee, uint256 weiAmount, bytes32 spaceId, uint256 tokenId);

  // spaceId => payer address => tokenId => deposit
  mapping(bytes32 => mapping (address => mapping(uint256 => uint256))) private _deposits;

  // spaceId => payer address => tokenId => State
  mapping(bytes32 => mapping (address => mapping(uint256 => State))) private _states;

  function depositOf(address payer, bytes32 spaceId, uint256 tokenId) public view returns (uint256) {
    return _deposits[spaceId][payer][tokenId];
  }

  function depositState(address payer, bytes32 spaceId, uint256 tokenId) public view returns (State) {
    return _states[spaceId][payer][tokenId];
  }

  function deposit(address payer, bytes32 spaceId, uint256 tokenId) public payable virtual {
    uint256 amount = msg.value;
    _deposits[spaceId][payer][tokenId] += amount;
    _states[spaceId][payer][tokenId] = State.Checkin;
    emit Deposited(payer, amount, spaceId, tokenId);
  }

  // Complete withdraw  - state "Checkout" only
  function withdraw(
    address payer,
    address payable payee,
    bytes32 spaceId,
    uint256 tokenId
  ) internal virtual {
    uint256 payment = _deposits[spaceId][payer][tokenId];

    require(payment >= 0, "Insufficient funds");
    require(
      _states[spaceId][payer][tokenId] == State.Checkout,
      "Complete withdraw not allowed in this state"
    );
    _deposits[spaceId][payer][tokenId] = 0;
    _states[spaceId][payer][tokenId] = State.Closed;

    if (payment > 0) {
      payee.sendValue(payment);
      emit Withdraw(payer, payee, payment, spaceId, tokenId);
    }
  }

  // Partial withdraw - state "Checkin"
  function withdraw(
    address payer,
    address payable payee,
    uint256 payment,
    bytes32 spaceId,
    uint256 tokenId
  ) internal virtual {
    require(payment <= _deposits[spaceId][payer][tokenId], "Insufficient funds");

    _deposits[spaceId][payer][tokenId] = _deposits[spaceId][payer][tokenId] - payment;
    _states[spaceId][payer][tokenId] = State.Checkout;
    payee.sendValue(payment);

    emit Withdraw(payer, payee, payment, spaceId, tokenId);
  }
}
