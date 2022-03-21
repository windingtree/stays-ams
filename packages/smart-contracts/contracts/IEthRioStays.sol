// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;


abstract contract IEthRioStays {

  // Events
  event LodgingFacilityCreated(bytes32 facilityId, address indexed owner, string dataURI);
  event LodgingFacilityUpdated(bytes32 facilityId, string dataURI);
  event LodgingFacilityActiveState(bytes32 facilityId, bool active);
  event LodgingFacilityOwnershipTransfer(bytes32 facilityId, address indexed prevOwner, address indexed newOwner);
  event LodgingFacilityRemoved(bytes32 facilityId);
  event SpaceAdded(bytes32 spaceId, bytes32 facilityId, uint256 capacity, uint256 pricePerNightWei, bool active, string dataURI);
  event SpaceUpdated(bytes32 spaceId, bytes32 facilityId, uint256 capacity, uint256 pricePerNightWei, bool active, string dataURI);
  event SpaceRemoved(bytes32 spaceId);
  event NewStay(bytes32 spaceId, uint256 tokenId);
  event CheckIn(uint256 tokenId);
  event CheckOut(uint256 tokenId);

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
  function updateSpace(bytes32 _spaceId, uint256 _capacity, uint256 _pricePerNightWei, bool _active, string calldata _dataURI) public virtual;
  function deleteSpace(bytes32 _spaceId) public virtual;

  // Delegates (addresses that can perform certain actions, like check-in and check-out)
  // function addDelegate(bytes32 _lodgingFacilityId, address _delegate, uint8 _accessLevel) public virtual;
  // function changeDelegateAccessLevel(bytes32 _lodgingFacilityId, address _delegate, uint8 _accessLevel) public virtual;
  // function removeDelegate(bytes32 _lodgingFacilityId, address _delegate) public virtual;

  // Stays
  function newStay(bytes32 _spaceId, uint256 _startDay, uint256 _numberOfDays, uint256 _quantity) public payable virtual returns (uint256);
  // getting all my Stays is via built-in NFT contract getter
  // getting Stay details is via NFT's tokenURI getter
  // function getAllStayIdsByFacilityId(bytes32 _lodgingFacilityId) public virtual returns (uint256[] memory);
  function getCurrentStayIdsByFacilityId(bytes32 _lodgingFacilityId) public virtual returns (bytes32[] memory);
  function getFutureStayIdsByFacilityId(bytes32 _lodgingFacilityId) public virtual returns (bytes32[] memory);
  function checkIn(uint256 _tokenId) public virtual;
  function checkOut(uint256 _tokenId) public virtual;

  // function requestChange(uint256 _tokenId, bytes32 _spaceId, uint256 _startDay, uint256 _numberOfDays, uint256 _quantity) public payable virtual;
  // function requestCancel(int256 _tokenId) public virtual;
  // function requestResponse(uint256 _tokenId, bool _answer) public virtual;
  // @todo change my contact information

  // Reviews
  // @todo leave a LF review
  // @todo leave a Guest review
  // @todo answer a review
  // @todo start a dispute on a review
}
