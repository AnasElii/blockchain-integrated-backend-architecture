// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketplace is ERC721URIStorage {
    address payable contractOwner;
    uint public listingPrice = 10000000 wei;

    struct NFT {
        uint id;
        address payable contractAddress;
        address payable owner;
        uint price;
    }

    Counters.Counter private _nftIds;
    mapping(uint => NFT) private _idToNFT;

    event NFTListed(
        uint indexed id,
        address payable contractAddress,
        address payable owner,
        uint price
    );

    event NFTTransfer(
        uint indexed id,
        address payable seller,
        address payable buyer,
        uint price
    );

    constructor() ERC721("TinTonNFT", "TNNFT") {
        contractOwner = payable(msg.sender);
    }

    // Getters
    function getNFTIDs() external view returns (uint) {
        return Counters.current(_nftIds);
    }

    function getListingPrice() external view returns (uint) {
        return listingPrice;
    }

    function getNFT(uint id) external view returns (NFT memory) {
        return _idToNFT[id];
    }

    function mintNFT(string memory _tokenURI, uint price) external payable {
        uint nftId = Counters.current(_nftIds);

        require(msg.value >= listingPrice, "Insufficient funds sent");

        _safeMint(msg.sender, nftId);
        _setTokenURI(nftId, _tokenURI);

        NFT storage newNFT = _idToNFT[nftId];

        newNFT.id = nftId;
        newNFT.contractAddress = payable(address(this));
        newNFT.owner = payable(msg.sender);
        newNFT.price = price;

        (bool transferFeeSuccess, ) = payable(contractOwner).call{
            value: listingPrice
        }("");

        require(
            transferFeeSuccess,
            "Failed to transfer listing fee to the owner"
        );

        emit NFTListed(
            nftId,
            payable(address(this)),
            payable(msg.sender),
            price
        );

        Counters.increment(_nftIds);
    }

    function buyNFT(uint id) external payable {
        require(id < Counters.current(_nftIds), "The Provided nft not exit");
        uint256 price = _idToNFT[id].price;
        address payable seller = _idToNFT[id].owner;
        address payable buyer = payable(msg.sender);

        require(msg.value == price, "Incorrect payment amount");

        (bool transferNFTPriceSuccess, ) = payable(seller).call{
            value: msg.value
        }("");

        require(transferNFTPriceSuccess, "Transfering ETH failed");

        emit NFTTransfer(id, seller, buyer, msg.value);

        _idToNFT[id].owner = payable(buyer);
        _transfer(seller, buyer, id);
    }
}
