const hre = require("hardhat");

async function main() {
  const ShoppingPlatform = await hre.ethers.getContractFactory("ShoppingPlatform");
  const shoppingPlatform = await ShoppingPlatform.deploy();
  await shoppingPlatform.deployed();

  console.log(ShoppingPlatform deployed to: ${shoppingPlatform.address});
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
