// contracts/DungeonsAndDragonsCharacter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DungeonsAndDragonsCharacter is ERC721, VRFConsumerBase, Ownable {
    using SafeMath for uint256;
    using Strings for string;

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    address public VRFCoordinator;
    // rinkeby: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
    address public LinkToken;
    // rinkeby: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709a

    uint256 constant MINT_LIMIT = 3;

    uint256 constant HATS_LEN = 33;
    uint256 constant EYES_LEN = 25;
    uint256 constant FACIAL_HAIRS_LEN = 2;
    uint256 constant EARRINGS_LEN = 4;
    uint256 constant MOUTHS_LEN = 15;
    uint256 constant EXTRAS_LEN = 1;
    uint256 constant SHIRTS_LEN = 11;
    uint256 constant SKINS_LEN = 6;
    uint256 constant BACKGROUNDS_LEN = 7;

    struct Character {
        uint256 hat;
        uint256 eye;
        uint256 facial_hair;
        uint256 earring;
        uint256 mouth;
        uint256 extra;
        uint256 shirt;
        uint256 skin;
        uint256 background;
        string name;
    }

    Character[] public characters;

    mapping(bytes32 => string) requestToCharacterName;
    mapping(bytes32 => address) requestToSender;
    mapping(bytes32 => uint256) requestToTokenId;
    mapping(address => uint256) senderToNumberOfMint;

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Rinkeby
     * Chainlink VRF Coordinator address: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
     * LINK token address:                0x01BE23585060835E02B77ef475b0Cc51aA1e0709
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     */
    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyhash)
        public
        VRFConsumerBase(_VRFCoordinator, _LinkToken)
        ERC721("DungeonsAndDragonsCharacter", "D&D")
    {   
        VRFCoordinator = _VRFCoordinator;
        LinkToken = _LinkToken;
        keyHash = _keyhash;
        fee = 0.1 * 10**18; // 0.1 LINK
    }

    function requestNewRandomCharacter(
        string memory name
    ) public returns (bytes32) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        require(
            senderToNumberOfMint[msg.sender] < MINT_LIMIT,
            "Maximum mint count is reached, can not try mint any more"
        );
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToCharacterName[requestId] = name;
        requestToSender[requestId] = msg.sender;
        senderToNumberOfMint[msg.sender]++;
        return requestId;
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

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        uint256 newId = characters.length;

        characters.push(
            Character(
                randomNumber % HATS_LEN,
                randomNumber % EYES_LEN,
                randomNumber % FACIAL_HAIRS_LEN,
                randomNumber % EARRINGS_LEN,
                randomNumber % MOUTHS_LEN,
                randomNumber % EXTRAS_LEN,
                randomNumber % SHIRTS_LEN,
                randomNumber % SKINS_LEN,
                randomNumber % BACKGROUNDS_LEN,
                requestToCharacterName[requestId]
            )
        );
        _safeMint(requestToSender[requestId], newId);
    }

    function getNumberOfCharacters() public view returns (uint256) {
        return characters.length;
    }
}
