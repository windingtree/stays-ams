// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

import "./IStayEscrow.sol";


abstract contract IStays is IStayEscrow {

  // Check-In voucher
  struct CheckInVoucher {
    address from;
    address to;
    uint256 tokenId;
    bytes signature;
  }

  // Events
  event LodgingFacilityCreated(bytes32 facilityId, address indexed owner, string dataURI);
  event LodgingFacilityUpdated(bytes32 facilityId, string dataURI);
  event LodgingFacilityActiveState(bytes32 facilityId, bool active);
  event LodgingFacilityOwnershipTransfer(bytes32 facilityId, address indexed prevOwner, address indexed newOwner);
  event LodgingFacilityRemoved(bytes32 facilityId);
  event SpaceAdded(bytes32 spaceId, bytes32 facilityId, uint256 capacity, uint256 pricePerNightWei, bool active, string dataURI);
  event SpaceUpdated(bytes32 spaceId, uint256 capacity, uint256 pricePerNightWei, string dataURI);
  event SpaceRemoved(bytes32 spaceId);
  event SpaceActiveState(bytes32 spaceId, bool active);
  event NewStay(bytes32 spaceId, uint256 tokenId);
  event CheckIn(uint256 tokenId);
  event CheckOut(uint256 tokenId);
  event Cancel(uint256 tokenId);

  // To display all availability in Glider: getActiveLodgingFacilityIds, getSpaceIdsByFacilityId, getAvailability
  function getAllLodgingFacilityIds() public view virtual returns (bytes32[] memory);
  function getActiveLodgingFacilityIds() public view virtual returns (bytes32[] memory);
  function getSpaceIdsByFacilityId(bytes32 _lodgingFacilityId) public virtual returns (bytes32[] memory);
  function getActiveSpaceIdsByFacilityId(bytes32 _lodgingFacilityId) public virtual returns (bytes32[] memory);
  function getAvailability(bytes32 _spaceId, uint256 _startDay, uint256 _numberOfDays) public view virtual returns (uint256[] memory);

  // For the lodging facility owner, to display their facilities
  function getLodgingFacilityIdsByOwner(address _owner) public virtual returns (bytes32[] memory);

  // Facility and spaces details
  function getLodgingFacilityById(bytes32 _lodgingFacilityId) public view virtual returns(
    bool exists,
    address owner,
    bool active,
    string memory dataURI
  );
  function getSpaceById(bytes32 _spaceId) public view virtual returns (
    bool exists,
    bytes32 lodgingFacilityId,
    uint256 capacity,
    uint256 pricePerNightWei,
    bool active,
    string memory dataURI
  );

  // Tokens by spaces and status
  function getTokensBySpaceId(bytes32 _spaceId, State _state) public view virtual returns (uint256[] memory);

  // Facility management
  function registerLodgingFacility(string calldata _dataURI, bool _active, address _fren) public virtual;
  function registerLodgingFacility(string calldata _dataURI, bool _active) public virtual;
  function updateLodgingFacility(bytes32 _lodgingFacilityId, string calldata _newDataURI) public virtual;
  function activateLodgingFacility(bytes32 _lodgingFacilityId) public virtual;
  function deactivateLodgingFacility(bytes32 _lodgingFacilityId) public virtual;
  function yieldLodgingFacility(bytes32 _lodgingFacilityId, address _newOwner) public virtual;
  function deleteLodgingFacility(bytes32 _lodgingFacilityId) public virtual;

  // Space management
  function addSpace(bytes32 _lodgingFacilityId, uint256 _capacity, uint256 _pricePerNightWei, bool _active, string calldata _dataURI) public virtual;
  function activateSpace(bytes32 _spaceId) public virtual;
  function deactivateSpace(bytes32 _spaceId) public virtual;
  function updateSpace(bytes32 _spaceId, uint256 _capacity, uint256 _pricePerNightWei, string calldata _dataURI) public virtual;
  function deleteSpace(bytes32 _spaceId) public virtual;

  // Stays
  function newStay(bytes32 _spaceId, uint256 _startDay, uint256 _numberOfDays, uint256 _quantity) public payable virtual returns (uint256);
  function checkIn(uint256 _tokenId, CheckInVoucher memory voucher) public virtual;
  function checkOut(uint256 _tokenId) public virtual;
}
