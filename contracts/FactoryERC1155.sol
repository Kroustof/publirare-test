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
  CountersUpgradeable.Counter public CONTRACT_IDS;
  CountersUpgradeable.Counter public TOTAL_CONTRACTS;

  address public CUT_RECEIVER; // PubliRare address to receive cut
  uint16 public CUT_IN_BIPS; // 1% equal 100 bips

  // Store address of each created contract
  mapping(uint256 => address) private ID_TO_CONTRACT;
  // Store owner of each created contract
  mapping(uint256 => address) private ID_TO_OWNER;
  // Whitelist user with Premium account
  mapping(address => bool) WHITELIST;

  event NewNFTContractDeployed(
    address contractAddress, 
    address indexed creator, 
    uint256 indexed contractID, 
    string nftType,
    address cutReceiver,
    string contractName
  );

  event AddedToWhitelist(address indexed account);

  event RemovedFromWhitelist(address indexed account);


  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize(address adminBackup) public initializer {
    __Ownable_init();
    __AccessControl_init();
    __Pausable_init();
    __UUPSUpgradeable_init();

    _grantRole(DEFAULT_ADMIN_ROLE, adminBackup);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(OPERATOR_ROLE, msg.sender);
    _grantRole(CENSOR_ROLE, msg.sender);
    _grantRole(PAUSER_ROLE, msg.sender);
    _grantRole(UPGRADER_ROLE, msg.sender);

    CUT_IN_BIPS = 250;
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
  {
    uint256 contractID = CONTRACT_IDS.current();

    NFTBook1155 newContract = new NFTBook1155(
      msg.sender, 
      amount, 
      maxCopies, 
      uri, 
      royaltyFeesInBips, 
      contractURI, 
      collectionName, 
      CUT_RECEIVER, 
      CUT_IN_BIPS
    );

    address newContractAddr = address(newContract);
    ID_TO_CONTRACT[contractID] = newContractAddr;
    ID_TO_OWNER[contractID] = msg.sender;
    CONTRACT_IDS.increment();
    TOTAL_CONTRACTS.increment();

    emit NewNFTContractDeployed(newContractAddr, msg.sender, contractID, "ERC1155", CUT_RECEIVER, collectionName);
  }

  //! =============== CUT SETTINGS ============================================

  // Set new receiver
  function setCutReceiver(address newReceiver) 
    public 
    onlyRole(OPERATOR_ROLE)
  {
    CUT_RECEIVER = newReceiver;
  }

  // Set new cut value
  function setCutInBips(uint16 cutInBips) 
    public 
    onlyRole(OPERATOR_ROLE)
  {
    CUT_IN_BIPS = cutInBips;
  }

  //! =============== FACTORY GETTERS ============================================

  // Get contract address
  function getContractAddress(uint256 contractID) 
    public view 
    returns(address) 
  {
    return ID_TO_CONTRACT[contractID];
  }

  // Get contract owner
  function getContractOwner(uint256 contractID) 
    public view 
    returns(address) 
  {
    return ID_TO_OWNER[contractID];
  }

  //! =============== WHITELISTED USERS ============================================

  modifier onlyWhitelisted(address userAddress) {
    require(WHITELIST[userAddress], "Account not whitelisted");
    _;
  }

  function addToWhitelist(address userAddress) 
    public 
    onlyRole(CENSOR_ROLE) 
  {
    WHITELIST[userAddress] = true;
    emit AddedToWhitelist(userAddress);
  }

  function removeFromWhitelist(address userAddress) 
    public 
    onlyRole(CENSOR_ROLE)  
  {
    WHITELIST[userAddress] = false;
    emit RemovedFromWhitelist(userAddress);
  }

  function isWhitelisted(address userAddress) 
    public view 
    returns(bool) 
  {
    return WHITELIST[userAddress];
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

  function grantARole(string memory role, address account) public {
    bytes32 grantedRole = keccak256(abi.encodePacked(role));
    grantRole(grantedRole, account);
  } 
  
}

