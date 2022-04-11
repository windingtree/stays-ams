// SPDX-License-Identifier: GPL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IStays.sol";
import "./StayEscrow.sol";
import "./libraries/StayTokenMeta.sol";


contract Stays is IStays, StayEscrow, ERC721URIStorage, ERC721Enumerable, EIP712, Pausable, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _stayTokenIds;

  uint32 public constant dayZero = 1645567342; // 22 Feb 2022
  string public constant serviceURI = "https://win.so/";
  string private constant tokenImageURI = 'https://bafybeihqdt5zgbda4yjmmzmsq2ipc4tbu64upaqa5uzglzt6siuxecgi4u.ipfs.dweb.link/token-min.png';

  // Lodging Facility is any type of accommodation: hotel, hostel, apartment, etc.
  struct LodgingFacility {
    address owner;
    bool active;
    bool exists;
    string dataURI;
    address fren;
  }

  // Space = Room Type
  struct Space {
    bytes32 lodgingFacilityId;
    uint256 capacity; // number of rooms of this type
    uint256 pricePerNightWei;
    bool active;
    bool exists;
    string dataURI; // must be conformant with "spaceSchemaURI"
  }

  // Stay
  struct Stay {
    bytes32 spaceId;
    uint256 startDay;
    uint256 numberOfDays;
    uint256 quantity;
    bool checkIn;
    bool checkOut;
  }

  bytes32[] private _lodgingFacilityIds;

  // Facility owner => LodgingFacility[]
  mapping (address => bytes32[]) private _facilityIdsByOwner;

  // facilityId => LodgingFacility
  mapping (bytes32 => LodgingFacility) public lodgingFacilities;

  // facilityId => spaceId[]
  mapping (bytes32 => bytes32[]) private _spaceIdsByFacilityId;

  // spaceId => Space
  mapping (bytes32 => Space) public spaces;

  // spaceId => daysFromDayZero => numberOfBookings
  mapping(bytes32 => mapping(uint256 => uint256)) private _booked;

  // Stay token => Stay
  mapping(uint256 => Stay) private _stays;

  // spaceId => tokenId[]
  mapping(bytes32 => uint256[]) private _stayTokens;

  constructor() ERC721("Stay Amsterdam", "STAYAMS") EIP712("Stay Amsterdam", "1") {}

  /**
   * Modifiers
   */
  modifier onlyLodgingFacilityOwner(bytes32 _lodgingFacilityId) {
    require(
      _msgSender() == lodgingFacilities[_lodgingFacilityId].owner,
      "Only lodging facility owner is allowed"
    );
    _;
  }

  modifier onlySpaceOwner(bytes32 _spaceId) {
    require(
      _msgSender() == lodgingFacilities[spaces[_spaceId].lodgingFacilityId].owner,
      "Only space owner is allowed"
    );
    _;
  }

  modifier onlyTokenOwner(uint256 _tokenId) {
    require(
      _msgSender() == ownerOf(_tokenId),
      "Only stay token owner is allowed"
    );
    _;
  }

  /**
   * Lodging Facilities Getters
   */
  // All registered Ids
  function getAllLodgingFacilityIds() public view override returns (bytes32[] memory) {
    return _lodgingFacilityIds;
  }

  // All ACTIVE facilities Ids
  function getActiveLodgingFacilityIds() public view override returns (bytes32[] memory activeLodgingFacilityIds) {
    activeLodgingFacilityIds = new bytes32[](_getActiveLodgingFacilitiesCount());
    uint256 index;

    for (uint256 i = 0; i < _lodgingFacilityIds.length; i++) {
      if (lodgingFacilities[_lodgingFacilityIds[i]].active) {
        activeLodgingFacilityIds[index] = _lodgingFacilityIds[i];
        index++;
      }
    }
  }

  // All spaces Ids from facility by Id
  function getSpaceIdsByFacilityId(bytes32 _lodgingFacilityId) public view override returns (bytes32[] memory) {
    return _spaceIdsByFacilityId[_lodgingFacilityId];
  }

  // All ACTIVE spaces Ids from facility by Id
  function getActiveSpaceIdsByFacilityId(bytes32 _lodgingFacilityId) public view override returns (bytes32[] memory activeSpacesIds) {
    activeSpacesIds = new bytes32[](_getActiveSpacesCount(_lodgingFacilityId));
    bytes32[] memory facilitiesSpaces = _spaceIdsByFacilityId[_lodgingFacilityId];
    uint256 index;

    for (uint256 i = 0; i < facilitiesSpaces.length; i++) {
      if (spaces[facilitiesSpaces[i]].active) {
        activeSpacesIds[index] = facilitiesSpaces[i];
        index++;
      }
    }
  }

  // Availability of the space
  function getAvailability(
    bytes32 _spaceId,
    uint256 _startDay,
    uint256 _numberOfDays
  ) public view override returns (uint256[] memory) {
    _checkBookingParams(_spaceId, _startDay, _numberOfDays);

    Space memory _s = spaces[_spaceId];
    uint256[] memory _availability = new uint256[](_numberOfDays);

    for (uint256 _x = 0; _x < _numberOfDays; _x++) {
      _availability[_x] = _s.capacity - _booked[_spaceId][_startDay + _x];
    }

    return _availability;
  }

  // Facilities by owner
  function getLodgingFacilityIdsByOwner(address _owner) public view override returns (bytes32[] memory) {
    return _facilityIdsByOwner[_owner];
  }

  // Facility details
  function getLodgingFacilityById(bytes32 _lodgingFacilityId) public view override returns(
    bool exists,
    address owner,
    bool active,
    string memory dataURI
  ) {
    LodgingFacility storage facility = lodgingFacilities[_lodgingFacilityId];
    exists = facility.exists;
    owner = facility.owner;
    active = facility.active;
    dataURI = facility.dataURI;
  }

  // Space details
  function getSpaceById(bytes32 _spaceId) public view override returns (
    bool exists,
    bytes32 lodgingFacilityId,
    uint256 capacity,
    uint256 pricePerNightWei,
    bool active,
    string memory dataURI
  ) {
    Space storage space = spaces[_spaceId];
    exists = space.exists;
    lodgingFacilityId = space.lodgingFacilityId;
    capacity = space.capacity;
    pricePerNightWei = space.pricePerNightWei;
    active = space.active;
    dataURI = space.dataURI;
  }

  // Returns a space details by Stay token Id
  function getSpaceByTokenId(uint256 _tokenId) public view returns (
    bool exists,
    bytes32 lodgingFacilityId,
    uint256 capacity,
    uint256 pricePerNightWei,
    bool active,
    string memory dataURI
  ) {
    return getSpaceById(_stays[_tokenId].spaceId);
  }

  // Get tokens Ids for a space filtered by a status
  function getTokensBySpaceId(
    bytes32 _spaceId,
    State _state
  ) public view override returns (uint256[] memory) {
    uint256[] storage _tokens = _stayTokens[_spaceId];
    uint256 count;

    for (uint256 i = 0; i < _tokens.length; i++) {
      if (depositState(_tokens[i]) == _state) {
        count++;
      }
    }

    uint256[] memory _stateTokens = new uint256[](count);
    uint256 index;

    for (uint256 i = 0; i < _tokens.length; i++) {
      if (depositState(_tokens[i]) == _state) {
        _stateTokens[index] = _tokens[i];
        index++;
      }
    }

    return _stateTokens;
  }

  /*
   * Lodging Facilities Management
   */

  // Lodging Facility registration (with fren option)
  function registerLodgingFacility(
    string calldata _dataURI,
    bool _active,
    address _fren
  )
    public override whenNotPaused
  {
    _dataUriMustBeProvided(_dataURI);

    bytes32 _id = keccak256(
      abi.encodePacked(
        _msgSender(),
        _dataURI
      )
    );

    require(!lodgingFacilities[_id].exists, "Facility already exists");

    lodgingFacilities[_id] = LodgingFacility(
      _msgSender(),
      _active,
      true,
      _dataURI,
      _fren
    );
    _lodgingFacilityIds.push(_id);
    _facilityIdsByOwner[_msgSender()].push(_id);

    emit LodgingFacilityCreated(_id, _msgSender(), _dataURI);
  }

  // Lodging Facility registration (WITHOUT fren option)
  function registerLodgingFacility(string calldata _dataURI, bool _active)
    public override whenNotPaused
  {
    return registerLodgingFacility(_dataURI, _active, address(0));
  }

  function updateLodgingFacility(
    bytes32 _lodgingFacilityId,
    string calldata _newDataURI
  ) public override onlyLodgingFacilityOwner(_lodgingFacilityId) {
    lodgingFacilities[_lodgingFacilityId].dataURI = _newDataURI;
    emit LodgingFacilityUpdated(_lodgingFacilityId, _newDataURI);
  }

  function activateLodgingFacility(bytes32 _lodgingFacilityId) public override onlyLodgingFacilityOwner(_lodgingFacilityId) {
    lodgingFacilities[_lodgingFacilityId].active = true;
    emit LodgingFacilityActiveState(_lodgingFacilityId, true);
  }

  function deactivateLodgingFacility(bytes32 _lodgingFacilityId) public override onlyLodgingFacilityOwner(_lodgingFacilityId) {
    lodgingFacilities[_lodgingFacilityId].active = false;
    emit LodgingFacilityActiveState(_lodgingFacilityId, false);
  }

  function yieldLodgingFacility(bytes32 _lodgingFacilityId, address _newOwner) public override onlyLodgingFacilityOwner(_lodgingFacilityId) {
    emit LodgingFacilityOwnershipTransfer(_lodgingFacilityId, lodgingFacilities[_lodgingFacilityId].owner, _newOwner);
    lodgingFacilities[_lodgingFacilityId].owner = _newOwner;
  }

  function deleteLodgingFacility(bytes32 _lodgingFacilityId) public override onlyLodgingFacilityOwner(_lodgingFacilityId) {
    lodgingFacilities[_lodgingFacilityId].exists = false;
    emit LodgingFacilityRemoved(_lodgingFacilityId);
  }

  /*
   * Spaces
   */
  function addSpace(
    bytes32 _lodgingFacilityId,
    uint256 _capacity,
    uint256 _pricePerNightWei,
    bool _active,
    string calldata _dataURI
  ) public override whenNotPaused {
    bytes32 _i = _lodgingFacilityId;

    _facilityShouldExist(_i);
    _shouldOnlyBeCalledByOwner(_i, "Only facility owner may add Spaces");
    _dataUriMustBeProvided(_dataURI);

    bytes32 _id = keccak256(abi.encodePacked(
      _i,
      _dataURI
    ));

    require(!spaces[_id].exists, "Space already exists");

    spaces[_id] = Space(
      _i,
      _capacity,
      _pricePerNightWei,
      _active,
      true,
      _dataURI
    );
    _spaceIdsByFacilityId[_i].push(_id);

    emit SpaceAdded(_id, _i, _capacity, _pricePerNightWei, _active, _dataURI);
  }

  function updateSpace(
    bytes32 _spaceId,
    uint256 _capacity,
    uint256 _pricePerNightWei,
    string calldata _dataURI
  ) public override onlySpaceOwner(_spaceId) {
    Space storage space = spaces[_spaceId];
    space.capacity = _capacity;
    space.pricePerNightWei = _pricePerNightWei;
    space.dataURI = _dataURI;

    emit SpaceUpdated(
      _spaceId,
      _capacity,
      _pricePerNightWei,
      _dataURI
    );
  }

  function activateSpace(bytes32 _spaceId) public override onlySpaceOwner(_spaceId) {
    spaces[_spaceId].active = true;
    emit SpaceActiveState(_spaceId, true);
  }

  function deactivateSpace(bytes32 _spaceId) public override onlySpaceOwner(_spaceId) {
    spaces[_spaceId].active = false;
    emit SpaceActiveState(_spaceId, false);
  }

  function deleteSpace(bytes32 _spaceId) public override onlySpaceOwner(_spaceId) {
    spaces[_spaceId].exists = false;
    emit SpaceRemoved(_spaceId);
  }

  /**
   * Stay escrow
   */

  function deposit(
    address payee,
    bytes32 spaceId,
    uint256 tokenId
  ) public payable override(IStayEscrow, StayEscrow) {
    super.deposit(payee, spaceId, tokenId);
  }

  // Complete withdraw. Allowed in Checkout deposit state only
  function withdraw(
    address payer,
    address payable payee,
    bytes32 _spaceId,
    uint256 tokenId
  )
    internal override(IStayEscrow, StayEscrow)
  {
    super.withdraw(payer, payee, _spaceId, tokenId);
  }

  // Partial withdraw
  function withdraw(
    address payer,
    address payable payee,
    uint256 payment,
    bytes32 _spaceId,
    uint256 tokenId
  ) internal override(IStayEscrow, StayEscrow) {
    // partial withdraw condition
    require(
      payment <= spaces[_spaceId].pricePerNightWei,
      "Withdraw amount not allows in this state"
    );
    super.withdraw(payer, payee, payment, _spaceId, tokenId);
  }

  /**
   * Stays
   */

  // Book a new stay in a space
  function newStay(
    bytes32 _spaceId,
    uint256 _startDay,
    uint256 _numberOfDays,
    uint256 _quantity
  ) public payable override whenNotPaused returns (uint256) {
    _checkBookingParams(_spaceId, _startDay, _numberOfDays);

    Space storage _s = spaces[_spaceId];
    uint256 _stayPrice = _numberOfDays * _quantity * _s.pricePerNightWei;

    require(msg.value >= _stayPrice, "Need. More. Money!");

    for (uint256 _x = 0; _x < _numberOfDays; _x++) {
      require(
        _s.capacity - _booked[_spaceId][_startDay+_x] >= _quantity,
        "Insufficient inventory"
      );
      _booked[_spaceId][_startDay+_x] += _quantity;
    }

    _stayTokenIds.increment();
    uint256 _newStayTokenId = _stayTokenIds.current();
    _safeMint(_msgSender(), _newStayTokenId);

    // Inline tokenURI (data:application/json;base64)
    string memory _tokenURI = StayTokenMeta.createTokenUri(
      _newStayTokenId,
      _s.lodgingFacilityId,
      _spaceId,
      _startDay,
      _numberOfDays,
      _quantity,
      tokenImageURI,
      serviceURI
    );
    _setTokenURI(_newStayTokenId, _tokenURI);

    _stays[_newStayTokenId] = Stay(
      _spaceId,
      _startDay,
      _numberOfDays,
      _quantity,
      false,
      false
    );
    _stayTokens[_spaceId].push(_newStayTokenId);

    deposit(_msgSender(), _spaceId, _newStayTokenId);

    emit NewStay(_spaceId, _newStayTokenId);

    return _newStayTokenId;
  }

  /**
   * CheckIn
   */

  // Stay checkIn; can be called by a stay token owner
  function checkIn(
    uint256 _tokenId,
    CheckInVoucher memory voucher
  ) public override {
    address recovered = _verifyCheckInVoucher(voucher);

    Stay storage _stay = _stays[_tokenId];
    bytes32 _spaceId = _stay.spaceId;

    require(_spaceId != bytes32(0), "Stay not found");
    require(!_stay.checkIn, "Already checked in");

    Space storage _space = spaces[_spaceId];
    LodgingFacility storage _lodgingFacility = lodgingFacilities[_space.lodgingFacilityId];

    require(
      recovered == ownerOf(_tokenId) || recovered == _lodgingFacility.owner,
      "Voucher signer is not allowed"
    );
    require(
      _msgSender() == voucher.to,
      "Wrong caller"
    );

    uint256 firstNight = _space.pricePerNightWei;

    // Partial withdraw, just for a first night
    _stay.checkIn = true;
    withdraw(
      ownerOf(_tokenId),
      payable(_lodgingFacility.owner),
      firstNight,
      _spaceId,
      _tokenId
    );

    emit CheckIn(_tokenId);
  }

  /**
   * CheckOut
   */

  function checkOut(uint256 _tokenId) public virtual override {
    Stay storage _stay = _stays[_tokenId];

    require(_stay.spaceId != bytes32(0), "Stay not found");
    require(!_stay.checkOut, "Already checked out");

    bytes32 _spaceId = _stay.spaceId;
    address spaceOwner = lodgingFacilities[spaces[_spaceId].lodgingFacilityId].owner;

    require(
      _msgSender() == spaceOwner,
      "Only space owner is allowed"
    );
    // CheckOut condition by time
    require(
      block.timestamp >= dayZero + (_stay.startDay + _stay.numberOfDays) * 86400,
      "Forbidden unless checkout date"
    );

    // Complete withdraw (rest of deposit)
    _stay.checkOut = true;
    withdraw(
      ownerOf(_tokenId),
      payable(spaceOwner),
      _spaceId,
      _tokenId
    );

    emit CheckOut(_tokenId);
  }

  /*
   * Helpers
   */

  function _facilityShouldExist(bytes32 _i) internal view {
    require(lodgingFacilities[_i].exists, "Facility does not exist");
  }

  function _spaceShouldExist(bytes32 _i) internal view {
    require(spaces[_i].exists, "Space does not exist");
  }

  function _shouldOnlyBeCalledByOwner(bytes32 _i, string memory _message) internal view {
    require(lodgingFacilities[_i].owner == _msgSender(), _message);
  }

  function _dataUriMustBeProvided(string memory _uri) internal pure {
    require(bytes(_uri).length > 0, "Data URI must be provided");
  }

  function _checkBookingParams(bytes32 _spaceId, uint256 _startDay, uint256 _numberOfDays) internal view {
    require(dayZero + _startDay * 86400 > block.timestamp - 86400 * 2, "Don't stay in the past");
    require(lodgingFacilities[spaces[_spaceId].lodgingFacilityId].active, "Lodging Facility is inactive");
    require(spaces[_spaceId].active, "Space is inactive");
    require(_numberOfDays > 0, "Number of days should be 1 or more");
  }

  function _getActiveLodgingFacilitiesCount() internal view returns (uint256 count) {
    for (uint256 i = 0; i < _lodgingFacilityIds.length; i++) {
      if (lodgingFacilities[_lodgingFacilityIds[i]].active) {
        count++;
      }
    }
  }

  function _getActiveSpacesCount(bytes32 _lodgingFacilityId) internal view returns (uint256 count) {
    bytes32[] storage facilitiesSpaces = _spaceIdsByFacilityId[_lodgingFacilityId];

    for (uint256 i = 0; i < facilitiesSpaces.length; i++) {
      if (spaces[facilitiesSpaces[i]].active) {
        count++;
      }
    }
  }

  // Throws an error if verification of a voucher is fails
  function _verifyCheckInVoucher(CheckInVoucher memory voucher) internal view returns (address) {
    bytes32 voucherHash = _hashTypedDataV4(
      keccak256(
        abi.encode(
          keccak256("Voucher(address from,address to,uint256 tokenId)"),
          voucher.from,
          voucher.to,
          voucher.tokenId
        )
      )
    );

    (address recovered, ECDSA.RecoverError error) = ECDSA.tryRecover(voucherHash, voucher.signature);

    require(
      error == ECDSA.RecoverError.NoError && recovered == voucher.from,
      "Broken voucher"
    );

    return recovered;
  }

  /** Governance */

  function pause() public whenNotPaused onlyOwner {
    _pause();
  }

  function unpause() public whenPaused onlyOwner {
    _unpause();
  }

  /** Overrides */

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
