// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

abstract contract IStayEscrow {
  enum State {
    Checkin,
    Checkout,
    Closed
  }

  event Deposited(address indexed payee, uint256 weiAmount, bytes32 spaceId, uint256 tokenId);
  event Withdraw(address indexed payer, address indexed payee, uint256 weiAmount, bytes32 spaceId, uint256 tokenId);
  event Refund(address indexed payee, uint256 weiAmount, bytes32 spaceId, uint256 tokenId);

  function depositOf(address payer, bytes32 spaceId, uint256 tokenId) public view virtual returns (uint256);
  function depositState(uint256 tokenId) public view virtual returns (State);
  function deposit(address payer, bytes32 spaceId, uint256 tokenId) public payable virtual;

  // Complete withdraw  - state "Checkout" only
  function withdraw(
    address payer,
    address payable payee,
    bytes32 spaceId,
    uint256 tokenId
  ) internal virtual;

  // Partial withdraw - state "Checkin"
  function withdraw(
    address payer,
    address payable payee,
    uint256 payment,
    bytes32 spaceId,
    uint256 tokenId
  ) internal virtual;

  // Refund deposit
  function refund(
    address payable payee,
    bytes32 spaceId,
    uint256 tokenId
  ) internal virtual;
}
