// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ShoppingPlatform {
    struct Item {
        string name;
        uint256 price;
        uint256 quantity;
    }

    struct Basket {
        Item[] items;
        uint256 totalAmount;
    }

    mapping(address => Basket) private baskets;

    
    function addToBasket(string memory itemName, uint256 price, uint256 quantity) public {
        baskets[msg.sender].items.push(Item(itemName, price, quantity));
        baskets[msg.sender].totalAmount += price * quantity;
    }

    
    function viewBasket() public view returns (Item[] memory items, uint256 totalAmount) {
        return (baskets[msg.sender].items, baskets[msg.sender].totalAmount);
    }

    
    function buy() public payable {
        require(baskets[msg.sender].totalAmount > 0, "Basket is empty");
        require(msg.value >= baskets[msg.sender].totalAmount, "Insufficient funds");

       
        delete baskets[msg.sender];
    }

    
    function cancelOrder() public {
        require(baskets[msg.sender].items.length > 0, "Basket is empty");

        
        delete baskets[msg.sender];
    }
}
