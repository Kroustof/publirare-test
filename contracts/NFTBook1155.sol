// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFTBook1155 is 
    ERC1155, 
    Ownable, 
    ERC1155Burnable, 
    ERC1155Supply 
{
    
    using Counters for Counters.Counter;
    Counters.Counter private BOOK_IDS;

    string public name;
    string public CONTRACT_URI;
    // PubliRare cut
    uint16 public PUBLIRARE_CUT; // 1% equal 100
    address private CUT_RECEIVER;

    struct Royalty {
        address royaltyReceiver;
        uint16 royaltyFeesInBips;
    }

    mapping(uint256 => uint256) private MAX_COPIES;
    mapping(uint256 => string) private BOOK_URIS;
    mapping(uint256 => Royalty) private ROYALTIES;
    

    event NewBookMinted(address indexed from, address indexed to, uint256 indexed id, uint256 amount, uint256 maxCopies);
    event MoreCopyMinted(address indexed from, address indexed to, uint256 indexed id, uint256 amount);

    constructor(address owner, uint256 amount, uint256 maxCopies, string memory bookURI, uint16 royaltyFeesInBips, string memory contractUri, string memory contractName, address cutReceiver, uint16 cutInBips) ERC1155("") {
        if (amount > maxCopies) {
            MAX_COPIES[0] = amount;  
        } else {
            MAX_COPIES[0] = maxCopies;
        }
        BOOK_URIS[0] = bookURI;
        ROYALTIES[0] = Royalty({royaltyReceiver: owner, royaltyFeesInBips: royaltyFeesInBips});
        CONTRACT_URI = contractUri;
        name = contractName;
        PUBLIRARE_CUT = cutInBips;
        CUT_RECEIVER = cutReceiver;
        BOOK_IDS.increment();
        _mint(cutReceiver, 0, calculateCut(maxCopies), "");
        _mint(owner, 0, (amount - calculateCut(maxCopies)), "");
        transferOwnership(owner);

        emit NewBookMinted(msg.sender, owner, 0, amount, MAX_COPIES[0]);
    }

    function uri(uint256 _id) 
        public view 
        override 
        returns (string memory) 
    {
        return (BOOK_URIS[_id]);
    }

    function contractURI() 
        public view 
        returns (string memory) 
    {
        return CONTRACT_URI;
    }

    function setbookUri(uint256 _id, string memory _uri) 
        public 
        onlyOwner 
    {
        BOOK_URIS[_id] = _uri;
    }

    function getMaxCopies(uint256 _id) 
        public view 
        returns (uint256) 
    {
        return (MAX_COPIES[_id]);
    }

    // Add a new book to the collection
    function mintNewBook(address to, uint256 amount, uint256 maxCopies, string memory _uri, uint16 _royaltyFeesInBips) 
        public 
        onlyOwner 
    {
        require(amount <= maxCopies, "Amount cant exceed copies limit");
        uint256 newBookId = BOOK_IDS.current();
        MAX_COPIES[newBookId] = maxCopies;
        BOOK_URIS[newBookId] = _uri;
        ROYALTIES[newBookId] = Royalty({royaltyReceiver: msg.sender, royaltyFeesInBips: _royaltyFeesInBips});
        BOOK_IDS.increment();
        _mint(CUT_RECEIVER, newBookId, calculateCut(maxCopies), "");
        _mint(to, newBookId, (amount - calculateCut(maxCopies)), "");

        emit NewBookMinted(msg.sender, to, newBookId, amount, maxCopies);
    }
    
    // Mint more copies of a specified book
    function mintBook(address to, uint256 _id, uint256 amount) 
        public 
        onlyOwner 
    {
        uint256 newTotalCopies = totalSupply(_id) + amount;
        require(newTotalCopies <= MAX_COPIES[_id], "Maximum copies limit reached");
        _mint(to, _id, amount, "");

        emit MoreCopyMinted(msg.sender, to, _id, amount);
    }

    // Mint more copies of multiple books
    function mintBookBatch(address to, uint256[] memory _ids, uint256[] memory amounts) 
        public 
        onlyOwner 
    {
        uint256 newTotalCopies;
        for (uint256 i = 0; i < _ids.length; i++) {
            newTotalCopies = totalSupply(_ids[i]) + amounts[i];
            require(newTotalCopies <= MAX_COPIES[_ids[i]], "One or more copies limit reached");
        }
        _mintBatch(to, _ids, amounts, "");
    }

    // Calculate PubliRre cut
    function calculateCut(uint256 amount) 
        internal view
        returns (uint256)
    {
        uint256 cut = amount * PUBLIRARE_CUT / 10000;
        if (amount <= 10) {
        return 0;
        } else if(cut <= 1) {
        return 1;
        } else {
        return cut;
        }
    }

    // Interface support for royalties
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155)
        returns (bool)
    {
        return interfaceId == 0x2a55205a || super.supportsInterface(interfaceId);
    }

    // Get royalty infos of a bookID 
    function royaltyInfo(uint256 _id, uint256 salePrice) 
        external view 
        returns (address receiver, uint256 royaltyAmount) 
    {
        return (ROYALTIES[_id].royaltyReceiver, calculateRoyalty(_id, salePrice));
    } 


    function calculateRoyalty(uint256 _id, uint256 salePrice) 
        public view 
        returns (uint256) 
    {
        return salePrice * ROYALTIES[_id].royaltyFeesInBips / 10000;
    }


    // Change royalty infos
    function setRoyaltyInfo(uint256 _id, address receiver, uint16 royaltyFeesInBips) 
        public 
        onlyOwner 
    {
        ROYALTIES[_id].royaltyReceiver = receiver;
        ROYALTIES[_id].royaltyFeesInBips = royaltyFeesInBips;
    }


    // Change contract URI
    function setContractURI(string calldata contractUri) 
        public 
        onlyOwner 
    {
        CONTRACT_URI = contractUri;
    }


    // Change contract name
    function setContractName(string memory _name) 
        public 
        onlyOwner 
    {
        name = _name;
    }


    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
        // if OpenSea's ERC1155 Proxy Address is detected, auto-return true
            // for Polygon's Mumbai testnet, use 0x53d791f18155C211FF8b58671d0f7E9b50E596ad
       if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        }
        // if PubliRare's ERC1155 Proxy Address is detected, auto-return true
            // for Polygon's Mumbai testnet, use 0x5B94Ef00531C80C5657bb0F5Cd35c692082f235E
       if (_operator == address(0x5B94Ef00531C80C5657bb0F5Cd35c692082f235E)) {
            return true;
        }
        // otherwise, use the default ERC1155.isApprovedForAll()
        return ERC1155.isApprovedForAll(_owner, _operator);
    }

}