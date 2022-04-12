// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "./IStayEscrow.sol";


abstract contract StayEscrow is IStayEscrow {
  using Address for address payable;

  // spaceId => payer address => tokenId => deposit
  mapping(bytes32 => mapping (address => mapping(uint256 => uint256))) private _deposits;

  // tokenId => State
  mapping(uint256 => State) private _states;

  function depositOf(address payer, bytes32 spaceId, uint256 tokenId) public view override(IStayEscrow) virtual returns (uint256) {
    return _deposits[spaceId][payer][tokenId];
  }

  function depositState(uint256 tokenId) public view override(IStayEscrow) virtual returns (State) {
    return _states[tokenId];
  }

  function deposit(address payer, bytes32 spaceId, uint256 tokenId) public payable override(IStayEscrow) virtual {
    uint256 amount = msg.value;
    _deposits[spaceId][payer][tokenId] += amount;
    _states[tokenId] = State.Checkin;
    emit Deposited(payer, amount, spaceId, tokenId);
  }

  // Complete withdraw  - state "Checkout" only
  function withdraw(
    address payer,
    address payable payee,
    bytes32 spaceId,
    uint256 tokenId
  ) internal override(IStayEscrow) virtual {
    uint256 payment = _deposits[spaceId][payer][tokenId];

    require(
      _states[tokenId] == State.Checkout,
      "Complete withdraw not allowed in this state"
    );
    _deposits[spaceId][payer][tokenId] = 0;
    _states[tokenId] = State.Closed;

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
  ) internal override(IStayEscrow) virtual {
    require(payment <= _deposits[spaceId][payer][tokenId], "Insufficient funds");

    _deposits[spaceId][payer][tokenId] = _deposits[spaceId][payer][tokenId] - payment;
    _states[tokenId] = State.Checkout;
    payee.sendValue(payment);

    emit Withdraw(payer, payee, payment, spaceId, tokenId);
  }

}
