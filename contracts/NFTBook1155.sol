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
    Counters.Counter private _BOOK_IDS;

    string public name;
    string public contractURI;
    // PubliRare cut
    uint16 public _PUBLIRARE_CUT; // 1% equal 100
    address private _CUT_RECEIVER;

    struct Royalty {
        address royaltyReceiver;
        uint16 royaltyFeesInBips;
    }

    mapping(uint256 => uint256) private _MAX_COPIES;
    mapping(uint256 => string) private _BOOK_URIS;
    mapping(uint256 => Royalty) private _ROYALTIES;
    

    event NewBookMinted(address indexed _from, address indexed _to, uint256 indexed _id, uint256 _amount, uint256 _maxCopies);
    event MoreCopyMinted(address indexed _from, address indexed _to, uint256 indexed _id, uint256 _amount);

    constructor(address owner, uint256 amount, uint256 maxCopies, string memory bookURI, uint16 _royaltyFeesInBips, string memory _contractURI, string memory contractName, address cutReceiver, uint16 cutInBips) ERC1155("") {
        if (amount > maxCopies) {
            _MAX_COPIES[0] = amount;  
        } else {
            _MAX_COPIES[0] = maxCopies;
        }
        _BOOK_URIS[0] = bookURI;
        _ROYALTIES[0] = Royalty({royaltyReceiver: owner, royaltyFeesInBips: _royaltyFeesInBips});
        contractURI = _contractURI;
        name = contractName;
        _PUBLIRARE_CUT = cutInBips;
        _CUT_RECEIVER = cutReceiver;
        _BOOK_IDS.increment();
        _mint(cutReceiver, 0, calculateCut(maxCopies), "");
        _mint(owner, 0, (amount - calculateCut(maxCopies)), "");
        transferOwnership(owner);

        emit NewBookMinted(msg.sender, owner, 0, amount, _MAX_COPIES[0]);
    }

    function uri(uint256 bookID) 
        public view 
        override 
        returns (string memory) 
    {
        return (_BOOK_URIS[bookID]);
    }

    function setbookUri(uint256 bookID, string memory bookURI) 
        public 
        onlyOwner 
    {
        _BOOK_URIS[bookID] = bookURI;
    }

    function getMaxCopies(uint256 bookID) 
        public view 
        returns (uint256) 
    {
        return (_MAX_COPIES[bookID]);
    }

    // Add a new book to the collection
    function mintNewBook(address to, uint256 amount, uint256 maxCopies, string memory bookURI, uint16 _royaltyFeesInBips) 
        public 
        onlyOwner 
    {
        require(amount <= maxCopies, "Amount cant exceed copies limit");
        uint256 newBookId = _BOOK_IDS.current();
        _MAX_COPIES[newBookId] = maxCopies;
        _BOOK_URIS[newBookId] = bookURI;
        _ROYALTIES[newBookId] = Royalty({royaltyReceiver: msg.sender, royaltyFeesInBips: _royaltyFeesInBips});
        _BOOK_IDS.increment();
        _mint(_CUT_RECEIVER, newBookId, calculateCut(maxCopies), "");
        _mint(to, newBookId, (amount - calculateCut(maxCopies)), "");

        emit NewBookMinted(msg.sender, to, newBookId, amount, maxCopies);
    }
    
    // Mint more copies of a specified book
    function mintBook(address to, uint256 bookID, uint256 amount) 
        public 
        onlyOwner 
    {
        uint256 newTotalCopies = totalSupply(bookID) + amount;
        require(newTotalCopies <= _MAX_COPIES[bookID], "Maximum copies limit reached");
        _mint(to, bookID, amount, "");

        emit MoreCopyMinted(msg.sender, to, bookID, amount);
    }

    // Mint more copies of multiple books
    function mintBookBatch(address to, uint256[] memory bookIDs, uint256[] memory amounts) 
        public 
        onlyOwner 
    {
        uint256 newTotalCopies;
        for (uint256 i = 0; i < bookIDs.length; i++) {
            newTotalCopies = totalSupply(bookIDs[i]) + amounts[i];
            require(newTotalCopies <= _MAX_COPIES[bookIDs[i]], "One or more copies limit reached");
        }
        _mintBatch(to, bookIDs, amounts, "");
    }

    // Calculate PubliRre cut
    function calculateCut(uint256 amount) 
        internal view
        returns (uint256)
    {
        uint256 cut = amount * _PUBLIRARE_CUT / 10000;
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
    function royaltyInfo(uint256 bookID, uint256 salePrice) 
        external view 
        returns (address receiver, uint256 royaltyAmount) 
    {
        return (_ROYALTIES[bookID].royaltyReceiver, calculateRoyalty(bookID, salePrice));
    } 


    function calculateRoyalty(uint256 bookID, uint256 salePrice) 
        public view 
        returns (uint256) 
    {
        return salePrice * _ROYALTIES[bookID].royaltyFeesInBips / 10000;
    }


    // Change royalty infos
    function setRoyaltyInfo(uint256 bookID, address _receiver, uint16 _royaltyFeesInBips) 
        public 
        onlyOwner 
    {
        _ROYALTIES[bookID].royaltyReceiver = _receiver;
        _ROYALTIES[bookID].royaltyFeesInBips = _royaltyFeesInBips;
    }


    // Change contract URI
    function setContractURI(string calldata _contractURI) 
        public 
        onlyOwner 
    {
        contractURI = _contractURI;
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
}
