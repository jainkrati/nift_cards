// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Base64.sol";

contract NIFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
    bool public paused = false;
    mapping(uint256 => Voucher) public idCardMapping;
    uint256 public stringLimit = 30;

    struct Voucher {
        string cardID;
        string description;
        uint amount;
        address payable redeemer;
        bool isRedeemed;
    }

    constructor() ERC721("NIFT", "NIFT") {
    }

    function mint(string memory description, uint256 amount ,address payable receiverAddress) public payable {
        require(msg.value == amount, "Token amount received is not equal to voucher amount");
        uint256 supply = totalSupply();
        require(bytes(description).length <= stringLimit, "Name input exceeds limit.");

        Voucher memory voucher = Voucher(
            string(abi.encodePacked("NIFT", uint256(supply + 1).toString())),
            string(abi.encodePacked("NIFT NFT for ", description)),
            amount,
            receiverAddress,
            false
        );

        idCardMapping[supply + 1] = voucher;
        _safeMint(receiverAddress, supply + 1);
    }

    function redeemVoucher(uint256 _tokenId) public {
        Voucher memory card = idCardMapping[_tokenId];
        require(card.isRedeemed == false , "Voucher is already redeemed");
        card.isRedeemed = true;
        card.redeemer.transfer(card.amount);
    }

    function buildVoucher(uint256 _tokenId) private view returns (string memory) {
        Voucher memory card = idCardMapping[_tokenId];
        return 
            Base64.encode(
                bytes(
                    abi.encodePacked(
                    '<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">',
                    '<defs>',
                    '<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">',
                    '<stop offset="0%" style="stop-color:rgb(0,255,0);stop-opacity:0.5" />',
                    '<stop offset="100%" style="stop-color:rgb(0,255,255);stop-opacity:0.5" />',
                    '</linearGradient>',
                    '<linearGradient id="rainbow" x1="0%" y1="50%" x2="100%" y2="50%">',
                    '<stop stop-color="#FF5B99" offset="0%"/>',
                    '<stop stop-color="#FF5447" offset="20%"/>',
                    '<stop stop-color="#FF7B21" offset="40%"/>',
                    '<stop stop-color="#EAFC37" offset="60%"/>',
                    '<stop stop-color="#4FCB6B" offset="80%"/>',
                    '<stop stop-color="#51F7FE" offset="100%"/>',
                    '</linearGradient>',
                    '</defs>',
                    '<rect id="svg_11" height="400" width="300" y="0" x="0" fill="url(#grad1)"/>',
                    '<text font-size="30" y="30%" x="50%" text-anchor="middle" fill="rgb(128,128,128)">',
                    card.description,
                    "</text>",
                    '<text font-size="18" y="45%" x="5%" fill="rgb(128,128,128)">',
                    card.amount,
                    " tokens </text>",
                    '<text font-size="18" y="50%" x="5%" fill="rgb(128,128,128)">',
                    "</text>",
                    '<text font-size="14" y="90%" x="65%" fill="rgb(128,128,128)">Powered By</text>',
                    '<text font-size="20" y="95%" x="65%" fill="url(#rainbow)">NIFT</text>',
                    '</svg>'
                    )
                )
            );
    }

    function buildMetadata(uint256 _tokenId)
        private
        view
        returns (string memory)
    {
        Voucher memory currentCard = idCardMapping[_tokenId];

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"description":"',
                                currentCard.description,
                                '", "amount":"',
                                currentCard.amount,
                                '", "image": "',
                                "data:image/svg+xml;base64,",
                                buildVoucher(_tokenId),
                                '", "attributes": ',
                                "[",
                                '{"trait_type": "CardType",',
                                '"value":"',
                                "NIFT",
                                '"}',
                                "]",
                                "}"
                            )
                        )
                    )
                )
            );
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return buildMetadata(_tokenId);
    }
}