// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Base64.sol";

library StayTokenMeta {

  string constant private _tokenImage = 'https://bafybeigg7mwwpnnm6mmk3twxc4arizoyc6ijnaye3pdciwcohheo7xi7hm.ipfs.dweb.link/token-image.png';

  function createTokenUri(
    uint256 tokenId,
    bytes32 facilityId,
    bytes32 spaceId,
    uint16 startDay,
    uint16 numberOfDays,
    uint16 quantity
  ) internal pure returns (string memory) {
    // Creation of data URI is split up into several functions because of
    // variables stack number restriction in Solidity
    return createDataUri(
      string(
        abi.encodePacked(
          '{',
          createMandatoryProps(tokenId),
          ',',
          createAttributesProps(facilityId, spaceId, startDay, numberOfDays, quantity),
          '}'
        )
      )
    );
  }

  function createMandatoryProps(uint256 tokenId) internal pure returns (string memory) {
    return string(
      abi.encodePacked(
        '"name":"EthRioStays #',
        uintToString(tokenId),
        '","description":"Stay at lodging facility","image":"',
        _tokenImage,
        '"'
      )
    );
  }

  function createAttributesProps(
    bytes32 facilityId,
    bytes32 spaceId,
    uint16 startDay,
    uint16 numberOfDays,
    uint16 quantity
  ) internal pure returns (string memory) {
    return string(
      abi.encodePacked(
        '"attributes":[{"trait_type":"facilityId","value":"',
        toHex(facilityId),
        '"},{"trait_type":"spaceId","value":"',
        toHex(spaceId),
        '"},{"trait_type":"startDay","value":"',
        uintToString(startDay),
        '"},{"trait_type":"numberOfDays","value":"',
        uintToString(numberOfDays),
        '"},{"trait_type":"quantity","value":"',
        uintToString(quantity),
        '"}]'
      )
    );
  }

  function createDataUri(string memory json) internal pure returns (string memory) {
    return string(
      abi.encodePacked(
        'data:application/json;base64,',
        Base64.encode(bytes(json))
      )
    );
  }

  function uintToString(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

    if (value == 0) {
      return "0";
    }
    uint256 temp = value;
    uint256 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
      digits -= 1;
      buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
      value /= 10;
    }
    return string(buffer);
  }

  function toHex16 (bytes16 data) internal pure returns (bytes32 result) {
    result = bytes32 (data) & 0xFFFFFFFFFFFFFFFF000000000000000000000000000000000000000000000000 |
      (bytes32 (data) & 0x0000000000000000FFFFFFFFFFFFFFFF00000000000000000000000000000000) >> 64;
    result = result & 0xFFFFFFFF000000000000000000000000FFFFFFFF000000000000000000000000 |
      (result & 0x00000000FFFFFFFF000000000000000000000000FFFFFFFF0000000000000000) >> 32;
    result = result & 0xFFFF000000000000FFFF000000000000FFFF000000000000FFFF000000000000 |
      (result & 0x0000FFFF000000000000FFFF000000000000FFFF000000000000FFFF00000000) >> 16;
    result = result & 0xFF000000FF000000FF000000FF000000FF000000FF000000FF000000FF000000 |
      (result & 0x00FF000000FF000000FF000000FF000000FF000000FF000000FF000000FF0000) >> 8;
    result = (result & 0xF000F000F000F000F000F000F000F000F000F000F000F000F000F000F000F000) >> 4 |
      (result & 0x0F000F000F000F000F000F000F000F000F000F000F000F000F000F000F000F00) >> 8;
    result = bytes32 (0x3030303030303030303030303030303030303030303030303030303030303030 +
      uint256 (result) +
      (uint256 (result) + 0x0606060606060606060606060606060606060606060606060606060606060606 >> 4 &
      0x0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F) * 7);
  }

  function toHex(bytes32 data) internal pure returns (string memory) {
    return string(
      abi.encodePacked(
        "0x",
        toHex16(bytes16(data)), toHex16(bytes16 (data << 128))
      )
    );
  }
}
