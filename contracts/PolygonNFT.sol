// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PolygonNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;                // uint256 variable as a counter

    // Mapping from token ID to IPFS hash (metaQube)
    mapping(uint256 => string) private _tokenURIs;

    // Mapping from token ID to encryption key (optional, can be removed)
    mapping(uint256 => string) private _encryptionKeys;

    constructor(address initialOwner) ERC721("iQubeNFT", "QNFT") Ownable(initialOwner) {}

    // Function to set the token URI
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    // Function to get the tokenURI
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    // Mint NFT
    function mintQube(address to, string memory uri, string memory encryptionKey) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;              // use counter
        _tokenIdCounter++;                              // increment counter

        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _encryptionKeys[tokenId] = encryptionKey;       // store the encryption key (optional)
    }

    // Function to get the token URI
    function getBlakQube(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    // Function to get the encryption key. Only the owner can get the encryption key
    function getEncryptionKey(uint256 tokenId) public view returns (string memory) {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner");
        return _encryptionKeys[tokenId];
    }

    // Transfer NFT
    function transferQube(address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        safeTransferFrom(msg.sender, to, tokenId);
    }

    // below is helper functions. these used to exist in the ERC721.sol but now they are removed, however still appear in live ERC721 documentation online.
    // Function to check if a token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    // Function to check if an address is approved or the owner of the token
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
}
