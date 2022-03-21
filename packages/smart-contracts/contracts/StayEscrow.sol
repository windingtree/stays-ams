// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

import "hardhat/console.sol";


abstract contract StayEscrow {
  using Address for address payable;

  enum State {
    Checkin,
    Checkout
  }

  event Deposited(address indexed payee, uint256 weiAmount, bytes32 spaceId);
  event Withdraw(address indexed payer, address indexed payee, uint256 weiAmount, bytes32 spaceId);

  // spaceId => payer address => deposit uint256
  mapping(bytes32 => mapping (address => uint256)) private _deposits;
  mapping(bytes32 => mapping (address => State)) private _states;

  function depositOf(address payer, bytes32 spaceId) public view returns (uint256) {
    return _deposits[spaceId][payer];
  }

  function depositState(address payer, bytes32 spaceId) public view returns (State) {
    return _states[spaceId][payer];
  }

  function deposit(address payer, bytes32 spaceId) public payable virtual {
    uint256 amount = msg.value;
    _deposits[spaceId][payer] += amount;
    _states[spaceId][payer] = State.Checkin;
    emit Deposited(payer, amount, spaceId);
  }

  // Complete withdraw  - state "Checkout" only
  function withdraw(
    address payer,
    address payable payee,
    bytes32 spaceId
  ) internal virtual {
    uint256 payment = _deposits[spaceId][payer];
    require(payment >= 0, "Insufficient funds");
    require(
      _states[spaceId][payer] == State.Checkout,
      "Complete withdraw not allowed in this state"
    );
    _deposits[spaceId][payer] = 0;

    if (payment == 0) {
      payee.sendValue(payment);
      emit Withdraw(payer, payee, payment, spaceId);
    }
  }

  // Partial withdraw - state "Checkin"
  function withdraw(
    address payer,
    address payable payee,
    uint256 payment,
    bytes32 spaceId
  ) internal virtual {
    require(payment <= _deposits[spaceId][payer], "Insufficient funds");
    _deposits[spaceId][payer] = _deposits[spaceId][payer] - payment;
    _states[spaceId][payer] = State.Checkout;
    payee.sendValue(payment);
    emit Withdraw(payer, payee, payment, spaceId);
  }
}
