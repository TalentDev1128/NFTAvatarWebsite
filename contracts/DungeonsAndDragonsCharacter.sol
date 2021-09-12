// contracts/DungeonsAndDragonsCharacter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DungeonsAndDragonsCharacter is ERC721, Ownable {
    using SafeMath for uint256;
    using Strings for string;

    uint256 constant MINT_LIMIT = 10;

    constructor()
        public
        ERC721("DungeonsAndDragonsCharacter", "D&D")
    {   
    }

    function requestNewRandomCharacter(
        uint256 tokenId,
        string memory _tokenURI
    ) public payable {
        // TODO msg.value > 0.01
        require(msg.value > 0);
        // Set limitation to the # of mint for each user
        require(
            balanceOf(msg.sender) < MINT_LIMIT,
            "Maximum mint count is reached, can not mint any more"
        );
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
