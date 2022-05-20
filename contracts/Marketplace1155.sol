// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "hardhat/console.sol";


contract Marketplace1155 is 
  Initializable, 
  OwnableUpgradeable, 
  AccessControlUpgradeable, 
  ERC1155HolderUpgradeable, 
  PausableUpgradeable, 
  ReentrancyGuardUpgradeable, 
  UUPSUpgradeable 
{

  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant CENSOR_ROLE = keccak256("CENSOR_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

  // IERC2981 Interface Royalties
  bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

  using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter public _ITEM_IDS; 
  CountersUpgradeable.Counter public _ITEMS_SOLD;

  address payable private _MARKET_FEE_RECEIVER;
  uint16 private _MARKET_FEE_IN_BIPS;
  address private _PUBLIRARE_STORE;

  enum ListingStatus { Active, Sold, Cancelled, Blacklisted }

  struct MarketItem {
    uint256 itemID;
    uint256 tokenID;
    uint256 amountToSell;
    uint256 price;
    address nftContract;
    address payable seller; // NFT seller may be different from creator
    address payable owner;
    address payable royaltyReceiver; // Only NFT contract owner can set this value
    uint16 royaltyInBips; // Only NFT contract owner can set this value
    ListingStatus status;
  }

  struct ResellOffer {
    address payable seller;
    uint256 resellID;
    uint256 amountToSell;
    uint256 price;
    ListingStatus status;
  }

  struct Offers {
    uint256 count;
    mapping(uint256 => ResellOffer) resellOffers;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;
  mapping(uint256 => Offers) public idToResellOffers;
  mapping(uint256 => bool) public isMarketItemBlacklisted;
  mapping(address => bool) public isSellerBlacklisted;

  event MarketItemCreated (
    uint256 indexed _itemID,
    address indexed _nftContract,
    uint256 indexed _tokenID,
    uint256 _amountToSell,
    address _seller,
    address _owner,
    uint256 _unitPrice,
    address _royaltyReceiver,
    uint256 _royaltyInBips
  );

  event MarketItemModified (
    uint256 indexed _itemID,
    uint256 _previousAmount,
    uint256 _newAmount,
    uint256 _previousPrice,
    uint256 _newPrice,
    address _seller
  );

  event MarketItemSale (
    uint256 indexed _itemID,
    address _buyer,
    address _seller,
    uint256 indexed _amount,
    uint256 _price
  );
  
  event MarketItemSold (
    uint256 indexed _itemID,
    address _seller
  );

  event MarketItemCancelled (
    uint256 indexed _itemID,
    address _seller
  );

  event MarketItemBlacklisted (
    uint256 indexed _itemID,
    address _nftContract,
    uint256 _tokenID,
    address _seller,
    uint256 _amountLeftToSell
  );

  event SellerBlacklisted (
    address _seller
  );

  event NewResellOffer (
    uint256 indexed _itemID,
    uint256 indexed _resellID,
    address indexed _seller,
    uint256 _amountToSell,
    uint256 _unitPrice
  );

  event ReselledItemSale (
    uint256 indexed _itemID,
    uint256 indexed _resellID,
    address _buyer,
    address indexed _seller,
    uint256 _amount,
    uint256 _price
  );

  event ReselledItemSold (
    uint256 indexed _itemID,
    uint256 indexed _resellID,
    address _seller,
    uint256 _unitPrice
  );

  event ReselledOfferModified (
    uint256 indexed _itemID,
    uint256 indexed _resellID,
    uint256 _newAmount,
    uint256 _newPrice,
    address _seller,
    ListingStatus indexed _status
  );


  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize() public initializer {
    __Ownable_init();
    __AccessControl_init();
    __Pausable_init();
    __ReentrancyGuard_init();
    __UUPSUpgradeable_init();
    __ERC1155Holder_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(OPERATOR_ROLE, msg.sender);
    _grantRole(CENSOR_ROLE, msg.sender);
    _grantRole(PAUSER_ROLE, msg.sender);
    _grantRole(UPGRADER_ROLE, msg.sender);

    _MARKET_FEE_RECEIVER = payable(msg.sender);
    _MARKET_FEE_IN_BIPS = 150;
  }

  //! =============== CREATE NEW MARKET ITEM BY AUTHOR ============================================
  
  // List an item for sale on the marketplace with full information and control
  function createMarketItem(
    address nftContract,
    uint256 tokenID,
    uint256 amount,
    uint256 price,
    address payable royaltyReceiver,
    uint16 royaltyInBips
  ) 
    public payable 
    onlyPositivePriceAndAmount(price, amount)
    notBlacklisted(msg.sender, 0)
    nonReentrant
    whenNotPaused
  {
    // Check if book is from PubliRare Store
    if (nftContract == _PUBLIRARE_STORE) {
      bytes memory fetchAuthor = AddressUpgradeable.functionCall(_PUBLIRARE_STORE, abi.encodeWithSignature("getBookAuthor(uint256)", tokenID)); 
      require(abi.decode(fetchAuthor, (address)) == msg.sender, "Only the author from Store can create a new Market item");
    } else {
      require(OwnableUpgradeable(nftContract).owner() == msg.sender, "Only NFT contract owner can create a new Market item");
    }

    require(!isMarketItemListed(nftContract, tokenID), "NFT already listed.");
    
    _ITEM_IDS.increment();
    uint256 itemID = _ITEM_IDS.current();

    idToMarketItem[itemID] = MarketItem(
      itemID,
      tokenID,
      amount,
      price,
      nftContract,
      payable(msg.sender),
      payable(address(0)),
      payable(royaltyReceiver),
      royaltyInBips,
      ListingStatus.Active
    );

    IERC1155Upgradeable(nftContract).safeTransferFrom(msg.sender, address(this), tokenID, amount, "");

    emit MarketItemCreated(itemID, nftContract, tokenID, amount, msg.sender, address(0), price, royaltyReceiver, royaltyInBips);
  }
  
  //! =============== LIST NEW ITEM BY OTHERS (not contract owner or author) ============================================

  // List an item for sale on the marketplace
  function listNewMarketItem(
    address nftContract,
    uint256 tokenID,
    uint256 amount,
    uint256 price
  ) 
    public payable 
    onlyPositivePriceAndAmount(price, amount)
    notBlacklisted(msg.sender, 0)
    nonReentrant
    whenNotPaused
  {
    require(!isMarketItemListed(nftContract, tokenID), "NFT already listed.");

    address minter = OwnableUpgradeable(nftContract).owner();

    require(!isSellerBlacklisted[minter], "Seller is blacklisted");
    
    _ITEM_IDS.increment();
    uint256 itemID = _ITEM_IDS.current();


    idToMarketItem[itemID] = MarketItem(
      itemID,
      tokenID,
      0,
      0,
      nftContract,
      payable(minter),
      payable(minter),
      payable(address(0)),
      0,
      ListingStatus.Sold
    );

    emit MarketItemCreated(itemID, nftContract, tokenID, 0, minter, address(0), price,address(0), 0);

    Offers storage newOfferList = idToResellOffers[itemID];
    newOfferList.count += 1;
    uint256 resellID = newOfferList.count;
    newOfferList.resellOffers[resellID] = ResellOffer({
      seller: payable(msg.sender),
      resellID: resellID,
      amountToSell: amount,
      price: price,
      status: ListingStatus.Active
    });

    IERC1155Upgradeable(nftContract).safeTransferFrom(msg.sender, address(this), tokenID, amount, "");

    emit NewResellOffer(itemID, 1, msg.sender, amount, price);
  }

  //! =============== MODIFY MARKET ITEM ============================================

  function modifyMarketItem(
    uint256 itemID,
    uint256 amount,
    uint256 price,
    address payable royaltyReceiver,
    uint16 royaltyInBips
  ) 
    public payable
    onlyPositivePriceAndAmount(price, amount)
    notBlacklisted(msg.sender, 0)
    nonReentrant
    whenNotPaused
  {
    MarketItem storage marketItem = idToMarketItem[itemID];

    require(marketItem.seller == msg.sender, "Only seller can modify market item");

    uint256 cancelledAmount = marketItem.amountToSell;
    uint256 previousPrice = marketItem.price;
    marketItem.amountToSell = amount;
    marketItem.price = price;
    marketItem.royaltyInBips = royaltyInBips;
    marketItem.royaltyReceiver = royaltyReceiver;
    marketItem.status = ListingStatus.Active;

    IERC1155Upgradeable(marketItem.nftContract).safeTransferFrom(address(this), msg.sender, marketItem.tokenID, cancelledAmount, "");
    IERC1155Upgradeable(marketItem.nftContract).safeTransferFrom(msg.sender, address(this), marketItem.tokenID, amount, "");

    emit MarketItemModified(itemID, cancelledAmount, marketItem.amountToSell, previousPrice, marketItem.price, msg.sender);
  }

  //! =============== CANCEL MARKET ITEM LISTING ============================================

  function cancelMarketItem(uint256 itemID)
    public
    notBlacklisted(msg.sender, itemID)
    nonReentrant
    whenNotPaused
  {
    MarketItem storage marketItem = idToMarketItem[itemID];

    require(marketItem.seller == msg.sender, "Only seller can cancel listing");
    require(marketItem.amountToSell > 0, "You must have at least 1 item to sell");
    require(marketItem.status == ListingStatus.Active, "Listing is not active");

    uint256 cancelledAmount = marketItem.amountToSell;
    marketItem.owner = marketItem.seller;
    marketItem.amountToSell = 0;
    marketItem.price = 0;
    marketItem.status = ListingStatus.Cancelled;

    IERC1155Upgradeable(marketItem.nftContract).safeTransferFrom(address(this), msg.sender, marketItem.tokenID, cancelledAmount, "");

    emit MarketItemCancelled(marketItem.itemID, marketItem.seller);
  }

  //! =============== MARKET SALE ============================================

  function createMarketSale(
    uint256 itemID, 
    uint256 amount
  )
    public payable
    nonReentrant
    whenNotPaused
  {
    MarketItem storage marketItem = idToMarketItem[itemID];
    uint256 price = amount * marketItem.price;

    require(marketItem.price > 0,"Item price cannot be 0");
    require(msg.value == price,"Please submit the asking price in order to complete the purchase");
    require(amount <= marketItem.amountToSell, "Not enough items to buy");
    require(marketItem.status == ListingStatus.Active, "All items listed have been sold or cancelled");

    (address royaltyReceiver, uint256 royaltyFee) = getRoyaltyInfo(itemID, msg.value);

    uint256 marketFee = msg.value * _MARKET_FEE_IN_BIPS / 10000;
    uint256 mainFee = msg.value - royaltyFee - marketFee;

    emit MarketItemSale(itemID, msg.sender, marketItem.seller, amount, price);

    _MARKET_FEE_RECEIVER.transfer(marketFee);
    marketItem.seller.transfer(mainFee);
    if (royaltyFee > 0 || royaltyReceiver == address(0)) {
      payable(royaltyReceiver).transfer(royaltyFee);
    }

    IERC1155Upgradeable(marketItem.nftContract).safeTransferFrom(address(this), msg.sender, marketItem.tokenID, amount, "");

    marketItem.amountToSell -= amount;
    if (marketItem.amountToSell == 0) {
      marketItem.owner = marketItem.seller;
      marketItem.status = ListingStatus.Sold;
      _ITEMS_SOLD.increment();
      emit MarketItemSold(itemID, marketItem.seller);
    }
  }

  //! =============== FETCH MARKET ITEMS ============================================

  function fetchMarketItems() 
    public view 
    returns (MarketItem[] memory) 
  {
    uint256 itemCount = _ITEM_IDS.current();
    uint256 unsoldItemCount = _ITEM_IDS.current() - _ITEMS_SOLD.current();
    uint256 currentIndex;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);

    for (uint256 i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].status == ListingStatus.Active) {
        uint256 currentID = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentID];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  //! =============== FETCH ONLY ITEMS PURCHASED BY USER ============================================

  function fetchMyNFTs()
    public view
    returns (MarketItem[] memory)
  {
    uint256 totalItemCount = _ITEM_IDS.current();
    uint256 itemCount;
    uint256 currentIndex;

    for (uint256 i = 0; i < totalItemCount; i++) {
      address itemContract = idToMarketItem[i + 1].nftContract;
      uint256 itemTokenID = idToMarketItem[i + 1].tokenID;
      uint256 itemBalanceOfUser = IERC1155Upgradeable(itemContract).balanceOf(msg.sender, itemTokenID);
      if (itemBalanceOfUser > 0) {
        itemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint256 i = 0; i < totalItemCount; i++) {
      address itemContract = idToMarketItem[i + 1].nftContract;
      uint256 itemTokenID = idToMarketItem[i + 1].tokenID;
      uint256 itemBalanceOfUser = IERC1155Upgradeable(itemContract).balanceOf(msg.sender, itemTokenID);
      if (itemBalanceOfUser > 0) {
        uint256 currentId = i + 1;
        MarketItem memory currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex++;
      }
    }
    return items;
  }

  //! =============== FETCH ONLY ITEMS CREATED BY USER ============================================

  function fetchMarketItemsCreated(address userAccount)
    public view
    returns (MarketItem[] memory)
  {
    uint256 totalItemCount = _ITEM_IDS.current();
    uint256 itemCount;
    uint256 currentIndex;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == userAccount) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == userAccount) {
        uint256 currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  //! =============== FETCH NFT DATA ============================================

  function fetchNFTData(uint256 itemID) 
    public view 
    returns (MarketItem memory) 
  {
    return idToMarketItem[itemID];
  }
  
  //! =============== CREATE RESELL ITEM OFFER ============================================

  function createReselledItem(
    uint256 itemID, 
    uint256 amount,
    uint256 price
  )
    public payable
    onlyPositivePriceAndAmount(price, amount)
    notBlacklisted(msg.sender, itemID)
    nonReentrant
    whenNotPaused
  {
    MarketItem memory marketItem = idToMarketItem[itemID];

    require(getResellerOfferID(itemID, msg.sender) == 0, "Offer previously created on this item"); // getResellId != 0
    
    Offers storage newOfferList = idToResellOffers[itemID];
    newOfferList.count += 1;
    uint256 resellID = newOfferList.count;
    newOfferList.resellOffers[resellID] = ResellOffer({
      seller: payable(msg.sender),
      resellID: resellID,
      amountToSell: amount,
      price: price,
      status: ListingStatus.Active
    });

    IERC1155Upgradeable(marketItem.nftContract).safeTransferFrom(msg.sender, address(this), marketItem.tokenID, amount, "");

    emit NewResellOffer(itemID, resellID, msg.sender, amount, price);
  }

  //! =============== MODIFY RESELL OFFER ============================================

  function modifyResellOffer(
    uint256 itemID,
    uint256 amount,
    uint256 price
  ) 
    public payable
    onlyPositivePriceAndAmount(price, amount)
    notBlacklisted(msg.sender, itemID)
    nonReentrant
    whenNotPaused
  {
    MarketItem memory marketItem = idToMarketItem[itemID];
    uint256 resellID = getResellerOfferID(itemID, msg.sender);
    
    require(resellID != 0, "No offer previously registered");

    ResellOffer storage offer = idToResellOffers[itemID].resellOffers[resellID];

    require(offer.seller == msg.sender, "Only seller can add more copies to sell");
    require(offer.status != ListingStatus.Active, "Offer must be cancelled before modification");

    offer.price = price;
    offer.amountToSell = amount;
    offer.status = ListingStatus.Active;

    IERC1155Upgradeable(marketItem.nftContract).safeTransferFrom(msg.sender, address(this), marketItem.tokenID, amount, "");

    emit ReselledOfferModified(itemID, resellID,  amount, offer.price,  msg.sender, offer.status);
  }

  //! =============== CANCEL RESELL OFFER ============================================

  function cancelResellOffer(uint256 itemID)
    public payable
    notBlacklisted(msg.sender, 0)
    nonReentrant
    whenNotPaused
  {
    uint256 resellID = getResellerOfferID(itemID, msg.sender);

    require(resellID != 0, "No offer previously registered");

    MarketItem memory marketItem = idToMarketItem[itemID];
    ResellOffer storage offer = idToResellOffers[itemID].resellOffers[resellID];

    require(offer.seller == msg.sender, "Only seller can change unit price");
    require(offer.status == ListingStatus.Active, "You cannot cancelled an offer not active");

    uint256 returnedAmount = offer.amountToSell;
    offer.amountToSell = 0;
    offer.price = 0;
    offer.status = ListingStatus.Cancelled;

    IERC1155Upgradeable(marketItem.nftContract).safeTransferFrom(address(this), msg.sender, marketItem.tokenID, returnedAmount, "");

    emit ReselledOfferModified(itemID, resellID, offer.amountToSell, offer.price, offer.seller, offer.status);
  }

  //! =============== RESELLED ITEM SALE ============================================

  function reselledItemSale(
    uint256 itemID, 
    uint256 resellID, 
    uint256 amount
  )
    public payable
    notBlacklisted(msg.sender, itemID)
    nonReentrant
    whenNotPaused
  {
    MarketItem memory marketItem = idToMarketItem[itemID];
    ResellOffer storage offer = idToResellOffers[itemID].resellOffers[resellID];
    
    uint256 price = amount * offer.price;
    uint256 tokenID = marketItem.tokenID;

    require(msg.value == price,"Please submit the asking price in order to complete the purchase");
    require(amount <= offer.amountToSell, "Not enough items to buy");
    require(offer.status == ListingStatus.Active,"All items listed have been sold or cancelled");

    (address royaltyReceiver, uint256 royaltyFee) = getRoyaltyInfo(itemID, msg.value);

    uint256 marketFee = msg.value * _MARKET_FEE_IN_BIPS / 10000;
    uint256 mainFee = msg.value - royaltyFee - marketFee;

    emit ReselledItemSale(itemID, resellID, msg.sender, offer.seller, amount, price);

    payable(_MARKET_FEE_RECEIVER).transfer(marketFee);
    offer.seller.transfer(mainFee);
    if (royaltyFee > 0 && royaltyReceiver != address(0)) {
      payable(royaltyReceiver).transfer(royaltyFee);
    }

    IERC1155Upgradeable(marketItem.nftContract).safeTransferFrom(address(this), msg.sender, tokenID, amount, "");

    offer.amountToSell -= amount;
    if (offer.amountToSell == 0) {
      offer.status = ListingStatus.Sold;
      emit ReselledItemSold(itemID, resellID, offer.seller, offer.price);
    }
  }

  //! =============== FETCH NFT RESELL OFFERS ============================================

  function fetchNFTResellOffers(uint256 itemID)
    public view 
    returns (ResellOffer[] memory) 
  {
    Offers storage offerList = idToResellOffers[itemID];

    uint256 activeOffersCount;
    uint256 currentIndex;

    for (uint256 i = 0; i < offerList.count; i++) {
      if (offerList.resellOffers[i + 1].status == ListingStatus.Active) {
        activeOffersCount++;
      }
    }

    ResellOffer[] memory activeOffers = new ResellOffer[](activeOffersCount);

    for (uint256 i = 0; i < offerList.count; i++) {
      if (offerList.resellOffers[i + 1].status == ListingStatus.Active) {
        ResellOffer storage currentOffer = offerList.resellOffers[i + 1];
        activeOffers[currentIndex] = currentOffer;
        currentIndex += 1;
      }
    }
    return activeOffers;
  }

  //! =============== FETCH ALL USER RESELL OFFERS ============================================

  function fetchMyResellOffers()
    public view
    returns (ResellOffer[] memory)
  {
    uint256 totalItemCount = _ITEM_IDS.current();
    uint256 userOffersCount;
    uint256 currentIndex;
      

    for (uint256 i = 0; i < totalItemCount; i++) {
      if(getResellerOfferID(i + 1, msg.sender) != 0) {
        userOffersCount += 1;
      }
    }

    ResellOffer[] memory myOffers = new ResellOffer[](userOffersCount);
    uint256 resellID;
    for (uint256 i = 0; i < totalItemCount; i++) {
      if(getResellerOfferID(i + 1, msg.sender) != 0) {
        resellID = getResellerOfferID(i + 1, msg.sender);
        myOffers[currentIndex] = idToResellOffers[i + 1].resellOffers[resellID];
        currentIndex++;
      }
    }
    return myOffers;
  }


  //! =============== HELPERS ============================================

  // Check if Market Item has already been listed
  function isMarketItemListed(
    address nftContract, 
    uint256 tokenID
  )
    public view
    returns (bool)
  {
    uint256 totalItemCount = _ITEM_IDS.current();
    bool offerExist;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].nftContract == nftContract && idToMarketItem[i + 1].tokenID == tokenID) {
        offerExist = true;
      }
    }
    return offerExist;
  }

  // Get array ID to the reselller offer
  function getResellerOfferID(
    uint256 itemID,
    address sellerAccount
  )
    public view
    returns (uint256)
  {
    // ResellOffer[] storage offerList = idToResellOffers[itemID];
    Offers storage offerList = idToResellOffers[itemID];
    uint256 resellID;

    for (uint256 i = 0; i < offerList.count; i++) {
      if (offerList.resellOffers[i + 1].seller == sellerAccount) {
        resellID = offerList.resellOffers[i + 1].resellID;
      }
    }
    return resellID;
  }

  // Check if NFT item implements IERC-2981 royalty infos
  function checkRoyalties(address _contract) 
    public view
    returns (bool) 
  {
    (bool success) = IERC165Upgradeable(_contract).supportsInterface(_INTERFACE_ID_ERC2981);
    return success;
  }

  // Return the royalty value base on market item data or on IERC2981 royaltyInfo
  function getRoyaltyInfo(uint256 itemID, uint256 _salePrice)
    public
    returns (address, uint256)
  {
    MarketItem memory marketItem = idToMarketItem[itemID];
    address nftContract = marketItem.nftContract;
    address royaltyReceiver;
    uint256 royaltyValue;
    if (checkRoyalties(nftContract)) {
      bytes memory royaltyInfo = AddressUpgradeable.functionCall(nftContract, abi.encodeWithSignature("royaltyInfo(uint256,uint256)", marketItem.tokenID, _salePrice));
      (royaltyReceiver, royaltyValue) = abi.decode(royaltyInfo, (address, uint256));
    } else {
      royaltyReceiver = marketItem.royaltyReceiver;
      royaltyValue = _salePrice * marketItem.royaltyInBips / 10000;
    }

    return (royaltyReceiver, royaltyValue);
  } 

  //! =============== MODIFIER ============================================

  modifier onlyPositivePriceAndAmount(uint256 price, uint256 amount) {
    _isPositivePriceAndAmount(price, amount);
    _;
  }

  function _isPositivePriceAndAmount(uint256 price, uint256 amount)
    internal pure
  {
    require(price > 0, "Price must be greater than 0");
    require(amount > 0, "You must have at least 1 item to sell");
  }

  modifier notBlacklisted(address seller, uint256 itemID) {
    _isBlacklisted(seller, itemID);
    _;
  }

  function _isBlacklisted(address seller, uint256 itemID) 
    internal view
  {
    require(!isSellerBlacklisted[seller], "Seller or reseller blacklisted");
    if(itemID != 0) {
      require(!isMarketItemBlacklisted[itemID], "Item is blacklisted");
    }
  }

  //! =============== MARKETPLACE SETTINGS ============================================

  function updateMarketFeeInBips(uint16 feeInBips)
    public
    onlyRole(OPERATOR_ROLE)
  {
    require(feeInBips < 5000, "Market fee cannot exceed 50%");
    _MARKET_FEE_IN_BIPS = feeInBips;
  }

  // Returns _MARKET_FEE_RECEIVER, _MARKET_FEE_IN_BIPS, _PUBLIRARE_STORE
  function getMarketSettings()
    public view
    returns (
      address marketFeeReceiver,
      uint16 marketFeeInBips,
      address storeAddress
    )
  {
    return (_MARKET_FEE_RECEIVER, _MARKET_FEE_IN_BIPS, _PUBLIRARE_STORE);
  }

  function setMarketFeeReceiver(address payable newReceiver)
    public
    onlyRole(OPERATOR_ROLE) 
  {
    _MARKET_FEE_RECEIVER = newReceiver;
  }

  function setStoreAddr(address storeAddr)
    public
    onlyRole(OPERATOR_ROLE)
  {
    _PUBLIRARE_STORE = storeAddr;
  }

  function blacklistMarketItem(uint256 itemID) 
    public
    onlyRole(CENSOR_ROLE)
  {
    MarketItem storage marketItem = idToMarketItem[itemID];

    marketItem.price = 0;
    marketItem.royaltyInBips = 0;
    marketItem.status = ListingStatus.Blacklisted;
    isMarketItemBlacklisted[itemID] = true;

    emit MarketItemBlacklisted(itemID, marketItem.nftContract, marketItem.tokenID, marketItem.seller, marketItem.amountToSell);
  }

  function blacklistSeller(address sellerAccount)
    public
    onlyRole(CENSOR_ROLE)
  {
    isSellerBlacklisted[sellerAccount] = false;
    
    emit SellerBlacklisted(sellerAccount);
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

  //! =============== ACCESS CONTROL ROLES ============================================

  // Extended control to Upgrade contract
  modifier onlyUpgraderExtended() {
    require(hasRole(UPGRADER_ROLE, msg.sender) || (msg.sender == owner()));
    _;
  }

  function grantARole(string memory role, address _account) public {
    bytes32 grantedRole = keccak256(abi.encodePacked(role));
    grantRole(grantedRole, _account);
  } 

  //! =============== UPGRADEABILITY ============================================
  
  // UPPS necessary upgrade function 
  function _authorizeUpgrade(address newImplementation)
    internal
    onlyUpgraderExtended
    override
  {}

  //! =============== OVERRIDE CONFLICT FUNCTIONS ============================================

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC1155ReceiverUpgradeable, AccessControlUpgradeable)
    returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }

}