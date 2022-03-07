// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Base64.sol";

library StayTokenMeta {

  function createTokenUri(
    uint256 tokenId,
    bytes32 facilityId,
    bytes32 spaceId,
    uint16 startDay,
    uint16 numberOfDays,
    uint16 quantity
  ) internal pure returns (string memory) {
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "EthRioStays #',
            uintToString(tokenId),
            '", "description": "Stay at lodging facility",',
            '"attributes":[{"trait_type":"facilityId","value":"',
            facilityId,
            '"},{"trait_type":"spaceId","value":"',
            spaceId,
            '"},{"trait_type": "startDay","value":"',
            uintToString(startDay),
            '"},{"trait_type": "numberOfDays","value":"',
            uintToString(numberOfDays),
            '"},{"trait_type": "quantity","value":"',
            uintToString(quantity),
            '"}]}'
          )
        )
      )
    );

    return string(abi.encodePacked('data:application/json;base64,', json));
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
}