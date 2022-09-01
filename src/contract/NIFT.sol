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
            description,
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
        return "ipfs/QmZ1La7dZ2DCTRj33awYvfQVTTY7zco2krieLvtHrmbzj9";
    }
}