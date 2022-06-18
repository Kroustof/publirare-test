// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./NFTBook1155.sol";


contract FactoryERC1155 is 
  Initializable, 
  OwnableUpgradeable, 
  AccessControlUpgradeable, 
  PausableUpgradeable, 
  UUPSUpgradeable 
{

  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant CENSOR_ROLE = keccak256("CENSOR_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

  using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter public _CONTRACT_IDS;
  CountersUpgradeable.Counter public _TOTAL_CONTRACTS;

  address public _CUT_RECEIVER; // PubliRare address to receive cut
  uint16 public _CUT_IN_BIPS; // 1% equal 100 bips

  // Store address of each created contract
  mapping(uint256 => address) private _ID_TO_CONTRACT;
  // Store owner of each created contract
  mapping(uint256 => address) private _ID_TO_OWNER;
  // Whitelist user with Premium account
  mapping(address => bool) whitelist;

  event NewNFTContractDeployed(
    address _contractAddress, 
    address indexed _creator, 
    uint256 indexed _contractID, 
    string indexed _type
  );

  event AddedToWhitelist(address indexed account);

  event RemovedFromWhitelist(address indexed account);


  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize(address _adminBackup) public initializer {
    __Ownable_init();
    __AccessControl_init();
    __Pausable_init();
    __UUPSUpgradeable_init();

    _grantRole(DEFAULT_ADMIN_ROLE, _adminBackup);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(OPERATOR_ROLE, msg.sender);
    _grantRole(CENSOR_ROLE, msg.sender);
    _grantRole(PAUSER_ROLE, msg.sender);
    _grantRole(UPGRADER_ROLE, msg.sender);

    _CUT_IN_BIPS = 50;
  }

  //! =============== CREATE NEW ERC1155 CONTRACT ============================================
  
  function createNewNFTBook(
    uint256 amount, 
    uint256 maxCopies,
    string memory uri, 
    uint16 royaltyFeesInBips, 
    string memory contractURI, 
    string memory collectionName
  ) 
    public payable 
    onlyWhitelisted(msg.sender) 
    whenNotPaused
    returns (address) 
  {
    uint256 contractID = _CONTRACT_IDS.current();

    NFTBook1155 newContract = new NFTBook1155(
      msg.sender, 
      amount, 
      maxCopies, 
      uri, 
      royaltyFeesInBips, 
      contractURI, 
      collectionName, 
      _CUT_RECEIVER, 
      _CUT_IN_BIPS
    );

    _ID_TO_CONTRACT[contractID] = address(newContract);
    _ID_TO_OWNER[contractID] = msg.sender;
    _CONTRACT_IDS.increment();
    _TOTAL_CONTRACTS.increment();

    emit NewNFTContractDeployed(address(newContract), msg.sender, contractID, "ERC1155");

    return address(newContract);
  }

  //! =============== CUT SETTINGS ============================================

  // Set new receiver
  function setCutReceiver(address _newReceiver) 
    public 
    onlyRole(OPERATOR_ROLE)
  {
    _CUT_RECEIVER = _newReceiver;
  }

  // Set new cut value
  function setCutInBips(uint16 _cutInBips) 
    public 
    onlyRole(OPERATOR_ROLE)
  {
    _CUT_IN_BIPS = _cutInBips;
  }

  //! =============== FACTORY GETTERS ============================================

  // Get contract address
  function getContractAddress(uint256 contractID) 
    public view 
    returns(address) 
  {
    return _ID_TO_CONTRACT[contractID];
  }

  // Get contract owner
  function getContractOwner(uint256 contractID) 
    public view 
    returns(address) 
  {
    return _ID_TO_OWNER[contractID];
  }

  //! =============== WHITELISTED USERS ============================================

  modifier onlyWhitelisted(address userAddress) {
    require(whitelist[userAddress], "Account not whitelisted");
    _;
  }

  function addToWhitelist(address userAddress) 
    public 
    onlyRole(CENSOR_ROLE) 
  {
    whitelist[userAddress] = true;
    emit AddedToWhitelist(userAddress);
  }

  function removeFromWhitelist(address userAddress) 
    public 
    onlyRole(CENSOR_ROLE)  
  {
    whitelist[userAddress] = false;
    emit RemovedFromWhitelist(userAddress);
  }

  function isWhitelisted(address userAddress) 
    public view 
    returns(bool) 
  {
    return whitelist[userAddress];
  }

  //! =============== SECURITY PAUSE CONTRACT ============================================

  function pause() 
    public 
    onlyRole(PAUSER_ROLE) 
  {
    _pause();
  }

  function unpause() 
    public 
    onlyRole(PAUSER_ROLE) 
  {
    _unpause();
  }
  
  //! =============== UPGRADEABILITY ============================================

  function _authorizeUpgrade(address newImplementation)
    internal
    onlyUpgraderExtended
    override
  {}

  //! =============== ACCESS CONTROL ============================================

  // Extra control Upgrade role
  modifier onlyUpgraderExtended() {
    require(hasRole(UPGRADER_ROLE, msg.sender) || (msg.sender == owner()));
    _;
  }

  function grantARole(string memory role, address _account) public {
    bytes32 grantedRole = keccak256(abi.encodePacked(role));
    grantRole(grantedRole, _account);
  } 
  
}

