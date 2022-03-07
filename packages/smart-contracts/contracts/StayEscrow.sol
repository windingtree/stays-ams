// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";


abstract contract StayEscrow {
  using Address for address payable;

  enum State {
    Checkin,
    Checkout
  }

  event Deposited(address indexed payee, uint256 weiAmount, bytes32 spaceId);
  event Withdrawn(address indexed payee, uint256 weiAmount, bytes32 spaceId);

  // spaceId => payee address => deposit uint256
  mapping(bytes32 => mapping (address => uint256)) private _deposits;
  mapping(bytes32 => mapping (address => State)) private _states;

  function depositsOf(address payee, bytes32 spaceId) public view returns (uint256) {
    return _deposits[spaceId][payee];
  }

  function depositsState(address payee, bytes32 spaceId) public view returns (State) {
    return _states[spaceId][payee];
  }

  function deposit(address payee, bytes32 spaceId) public payable virtual {
    uint256 amount = msg.value;
    _deposits[spaceId][payee] += amount;
    _states[spaceId][payee] = State.Checkin;
    emit Deposited(payee, amount, spaceId);
  }

  // Complete withdraw  - state "Checkout" only
  function withdraw(address payable payee, bytes32 spaceId) internal virtual {
    uint256 payment = _deposits[spaceId][payee];
    require(payment > 0, "Insufficient funds");
    require(
      _states[spaceId][payee] == State.Checkout,
      "Complete withdraw not allowed in this state"
    );
    _deposits[spaceId][payee] = 0;
    payee.sendValue(payment);
    emit Withdrawn(payee, payment, spaceId);
  }

  // Partial withdraw - state "Checkin"
  function withdraw(
    address payable payee,
    uint256 payment,
    bytes32 spaceId
  ) internal virtual {
    require(payment >= _deposits[spaceId][payee], "Insufficient funds");
    _deposits[spaceId][payee] = _deposits[spaceId][payee] - payment;
    _states[spaceId][payee] = State.Checkout;
    payee.sendValue(payment);
    emit Withdrawn(payee, payment, spaceId);
  }
}