// contracts/BlootAvatar.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BlootAvatar is ERC721, Ownable {
    using SafeMath for uint256;
    using Strings for string;

    ERC721 bloot = ERC721(0x4F8730E0b32B04beaa5757e5aea3aeF970E5B613);
    uint256 MINT_LIMIT = 5;

    constructor()
        public
        ERC721("BlootAvatar", "B&Avatar")
    {   
    }

    function requestNewBloot(
        uint256 tokenId,
        string memory _tokenURI
    ) public payable {
        // Require the claimer to have at least one bloot from the specified contract
        require(bloot.balanceOf(msg.sender) >= 1, "Need at least one bloot");
        // Set limit to no more than MINT_LIMIT times of the owned bloot
        require(super.balanceOf(msg.sender) < bloot.balanceOf(msg.sender) * MINT_LIMIT, "Mint limit reached. Purchase more bloot");
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        _setTokenURI(tokenId, _tokenURI);
    }
}
