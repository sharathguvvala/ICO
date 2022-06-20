//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWeb3Devs.sol";

contract Web3DevsToken is ERC20, Ownable {
    IWeb3Devs Web3DevsNFT;
    mapping(uint256=>bool) public tokenIdClaimed;
    uint256 public constant tokensPerNFT = 10 * 10**18;
    uint256 public constant tokenPrice = 0.001 ether;
    uint256 public constant maxTokenSupply = 1000 * 10**18;
    constructor(address _Web3DevsNFT) ERC20("We3DevsToken","W3D") {
        Web3DevsNFT = IWeb3Devs(_Web3DevsNFT);
    }
    function claim() public {
        address sender = msg.sender;
        uint256 balance = Web3DevsNFT.balanceOf(sender);
        require(balance > 0, "you dont own any web3devs nft");
        uint256 amount = 0;
        for(uint256 i = 0;i<balance;i++){
            uint256 tokenId = Web3DevsNFT.tokenOfOwnerByIndex(sender,i);
            if(!tokenIdClaimed[tokenId]){
                amount += 1;
                tokenIdClaimed[tokenId] = true;
            }
        }
        require(amount > 0, "you have claimed all your tokens");
        _mint(sender,amount*tokensPerNFT);
    }
    function mint(uint256 amount) public payable {
        uint256 requiredAmount = tokenPrice * amount;
        require(msg.value >= requiredAmount,"insufficient ether");
        uint amountWithDecimals = amount * 10**18;
        require(totalSupply() + amountWithDecimals <= maxTokenSupply,"");
        _mint(msg.sender,amountWithDecimals);
    }
    receive() external payable{}
    fallback() external payable{}
}