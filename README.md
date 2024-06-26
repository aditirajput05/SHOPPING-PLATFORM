
# Shopping Platform Smart Contract
This Solidity smart contract provides a basic shopping platform where users can add items to a basket, view their basket, buy items, and cancel their order.

## Description
This smart contract allows users to:

Add items to their shopping basket.
View the items in their basket and the total amount.
Purchase the items in their basket by sending the appropriate amount of Ether.
Cancel their order, clearing the basket.
## Getting Started
### Prerequisites
To work with this smart contract, you will need:

An Ethereum wallet such as MetaMask.
Access to an Ethereum test network (e.g., Rinkeby or Ropsten) or a local development environment like Ganache.
Remix IDE or another Solidity development environment.
### Executing the Program
To run this program, you can use Remix, an online Solidity IDE. Follow these steps:

Navigate to Remix:
Open your web browser and go to Remix Ethereum.

Create a New File:
In the Remix IDE, create a new file by clicking the "+" icon in the left-hand sidebar. Save the file with a .sol extension, for example, ShoppingPlatform.sol.

Copy and Paste the Code:
Copy the provided smart contract code and paste it into the new file.
solidity
Copy code
```
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
```
## Compile the Code:
Click on the "Solidity Compiler" tab in the left-hand sidebar. Make sure the compiler version is set to 0.8.0 (or another compatible version), then click "Compile ShoppingPlatform.sol".
## Deploy the Contract:
After compiling, click on the "Deploy & Run Transactions" tab in the left-hand sidebar. Select the "ShoppingPlatform" contract from the dropdown menu, then click "Deploy".

## Interact with the Contract:
After deployment, you can interact with the contract using the available functions (e.g., addToBasket, viewBasket, buy, cancelOrder). Each address acts as a different user, allowing you to perform various operations on it.

## Authors
Aditi Rajput
[@Chandigarh University](https://www.linkedin.com/in/aditi-rajput-b9360720b/)
## License
This project is licensed under the MIT License - see the LICENSE file for details.
