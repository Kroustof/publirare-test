// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

import "hardhat/console.sol";


contract PubliRareStore is 
  Initializable, 
  ERC1155Upgradeable, 
  OwnableUpgradeable, 
  AccessControlUpgradeable,
  PausableUpgradeable, 
  ERC1155BurnableUpgradeable, 
  ERC1155SupplyUpgradeable, 
  ERC1155HolderUpgradeable, 
  UUPSUpgradeable 
{

  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant CENSOR_ROLE = keccak256("CENSOR_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

  using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter private BOOK_IDS;

  // Contrat infos
  string public name;
  string public CONTRACT_URI;

  // Store limits
  uint8 public LIMIT_BOOKS;
  uint24 public MAX_COPIES;

  // Cut settings
  address public CUT_RECEIVER; // PubliRare address to receive cut
  uint16 public CUT_IN_BIPS; // 1% equal 100 bips
  address public PUBLIRARE_MARKETPLACE;

  struct Royalty {
    address royaltyReceiver;
    uint16 royaltyFeesInBips;
  }

  mapping(address => uint8) private AUTHOR_TO_LIMIT;
  mapping(uint256 => address) public BOOK_TO_AUTHOR;
  mapping(uint256 => string) private BOOK_URIS;
  mapping(uint256 => Royalty) private ROYALTIES;
  mapping(address => bool) private WHITELIST;


  event NewBookMinted(
    address indexed from, 
    uint256 indexed id, 
    uint256 amount
  );

  event CutTransfer(
    address indexed booksRceiver,
    address indexed author, 
    uint256 indexed id, 
    uint256 amount
  );

  event AddedToWhitelist(address indexed account);

  event RemovedFromWhitelist(address indexed account);

  event FallbackCalledEvent(bytes data);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize(string memory contractUri, address adminBackup) 
    initializer 
    public 
  {
    __ERC1155_init("");
    __Ownable_init();
    __AccessControl_init();
    __Pausable_init();
    __ERC1155Burnable_init();
    __ERC1155Supply_init();
    __UUPSUpgradeable_init();
    __ERC1155Holder_init();
    
    _grantRole(DEFAULT_ADMIN_ROLE, adminBackup);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(OPERATOR_ROLE, msg.sender);
    _grantRole(CENSOR_ROLE, msg.sender);
    _grantRole(PAUSER_ROLE, msg.sender);
    _grantRole(UPGRADER_ROLE, msg.sender);

    name = "NFT Book Editions";
    CONTRACT_URI = contractUri;
    LIMIT_BOOKS = 3;
    MAX_COPIES = 10000;
    CUT_IN_BIPS = 500; // 1% equal 100 bips
  }

  fallback() external {
    emit FallbackCalledEvent(msg.data);
  }

  //! =============== CREATE NEW BOOK TO STORE ============================================

  // Create a new book to the contract
  function mintNewBook(
    uint256 amount, 
    string memory bookURI, 
    uint16 royaltyFeesInBips
  ) 
    public
    onlyWhitelisted(msg.sender)
    whenNotPaused
  {
    require(AUTHOR_TO_LIMIT[msg.sender] < LIMIT_BOOKS, "Books limit reached");
    require(amount <= MAX_COPIES, "Limit of copies reached");

    AUTHOR_TO_LIMIT[msg.sender] += 1;
    uint256 newBookId = BOOK_IDS.current();

    BOOK_TO_AUTHOR[newBookId] = msg.sender;
    BOOK_URIS[newBookId] = bookURI;
    ROYALTIES[newBookId] = Royalty({royaltyReceiver: msg.sender, royaltyFeesInBips: royaltyFeesInBips});
    BOOK_IDS.increment();

    _mint(CUT_RECEIVER, newBookId, calculateCut(amount), "");
    _mint(msg.sender, newBookId, (amount - calculateCut(amount)), "");
    setApprovalForAll(PUBLIRARE_MARKETPLACE, true);
    
    emit NewBookMinted(msg.sender, newBookId, amount);
    emit CutTransfer(CUT_RECEIVER, msg.sender, newBookId, calculateCut(amount));
  }
   
  //! =============== BOOKS URIs ============================================

  // Override to get URI of a specific book
  function uri(uint256 _id) 
    public view 
    override 
    returns (string memory) 
  {
    return (BOOK_URIS[_id]);
  }

  // Set new URI of a specific book (Only PubliRare can call it)
  function setbookUri(uint256 _id, string memory _uri) 
    public 
    onlyRole(OPERATOR_ROLE)  
  {
    BOOK_URIS[_id] = _uri;
  }

  //! =============== CUT SETTINGS ============================================

  // Set new receiver
  function setCutReceiver(address newReceiver) 
    public 
    onlyRole(OPERATOR_ROLE) 
  {
    CUT_RECEIVER = newReceiver;
  }

  // Set a new cut percentage in bips
  function setCut(uint16 cutInBips) 
    public
    onlyRole(OPERATOR_ROLE) 
  {
    CUT_IN_BIPS = cutInBips;
  }

  //! =============== STORE SETTERS & GETTERS ============================================

  // Change contract URI
  function setContractURI(string calldata contractUri) 
    public 
    onlyRole(OPERATOR_ROLE)  
  {
    CONTRACT_URI = contractUri;
  }

  // Set limit of books created by one author address 
  function setLimitBooks(uint8 limit) 
    public
    onlyRole(OPERATOR_ROLE) 
  {
    LIMIT_BOOKS = limit;
  }

  // Set maximum copies of each books
  function setMaxCopies(uint24 maxCopies) 
    public
    onlyRole(OPERATOR_ROLE) 
  {
    MAX_COPIES = maxCopies;
  }

  function setMarketAddr(address marketAddr)
    public
    onlyRole(OPERATOR_ROLE)
  {
    PUBLIRARE_MARKETPLACE = marketAddr;
  }

  // Get total of books in the Store
  function getTotalBooks()
    public view
    returns (uint256)
  {
    return (BOOK_IDS.current());
  }

  // Get total of books in the Store
  function getBookAuthor(uint256 _id)
    public view
    returns (address)
  {
    return (BOOK_TO_AUTHOR[_id]);
  }

  // Get Store infos
  function contractURI() 
    public view 
    returns (string memory) 
  {
    return CONTRACT_URI;
  }
 
  //! =============== HELPERS ============================================

  // Calculate PubliRare cut
  function calculateCut(uint256 amount) 
    internal view
    returns (uint256)
  {
    uint256 cut = amount * CUT_IN_BIPS / 10000;
    if (amount <= 10) {
      return 0;
    } else if(cut <= 1) {
      return 1;
    } else {
      return cut;
    }
  }

  //! =============== ROYALTY INFO ============================================

  // Get royalty infos of a bookID 
  function royaltyInfo(
    uint256 _tokenId, 
    uint256 _salePrice
  ) 
    external view 
    returns (address receiver, uint256 royaltyAmount) 
  {
    return (ROYALTIES[_tokenId].royaltyReceiver, calculateRoyalty(_tokenId, _salePrice));
  } 

  function calculateRoyalty(
    uint256 _id, 
    uint256 salePrice
  ) 
    public view 
    returns (uint256) 
  {
    return salePrice * ROYALTIES[_id].royaltyFeesInBips / 10000;
  }

  // Change royalty infos
  function setRoyaltyInfo(
    uint256 _id, 
    address receiver,
    uint16 royaltyFeesInBips
  ) 
    public 
    onlyRole(OPERATOR_ROLE)  
  {
    ROYALTIES[_id].royaltyReceiver = receiver;
    ROYALTIES[_id].royaltyFeesInBips = royaltyFeesInBips;
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

  //! =============== ACCESS CONTROL ============================================

  // Extended control to Upgrade contract
  modifier onlyUpgraderExtended() {
    require(hasRole(UPGRADER_ROLE, msg.sender) || (msg.sender == owner()));
    _;
  }

  function grantARole(string memory role, address _account) public {
    bytes32 grantedRole = keccak256(abi.encodePacked(role));
    grantRole(grantedRole, _account);
  }

  //! =============== SECURITY PAUSE CONTRACT ============================================
  
  // Pause contract
  function pause() 
    public 
    onlyRole(PAUSER_ROLE)  
  {
    _pause();
  }

  // Unpause contract
  function unpause() 
    public 
    onlyRole(PAUSER_ROLE)  
  {
    _unpause();
  }

  //! =============== UPGRADEABILITY ============================================

  // UPPS necessary upgrade function 
  function _authorizeUpgrade(address newImplementation)
    internal
    onlyUpgraderExtended
    override
  {}

  //! =============== OVERRIDED FUNCTIONS ============================================

  // Interface support for royalties
  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC1155Upgradeable, ERC1155ReceiverUpgradeable, AccessControlUpgradeable)
    returns (bool)
  {
      return interfaceId == 0x2a55205a || super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    internal
    whenNotPaused
    override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
  {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
  
}
