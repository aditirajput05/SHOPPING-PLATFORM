import { useState, useEffect } from "react";
import { ethers } from "ethers";
import shoppingPlatformAbi from "../artifacts/contracts/ShoppingPlatform.sol/ShoppingPlatform.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [shoppingPlatform, setShoppingPlatform] = useState(undefined);
  const [basket, setBasket] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const shoppingPlatformABI = shoppingPlatformAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(undefined);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
      getShoppingPlatformContract();
    } catch (error) {
      setMessage("Error connecting account: " + (error.message || error));
    }
  };

  const getShoppingPlatformContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const shoppingPlatformContract = new ethers.Contract(contractAddress, shoppingPlatformABI, signer);

    setShoppingPlatform(shoppingPlatformContract);
  };

  const viewBasket = async () => {
    try {
      if (shoppingPlatform && account) {
        const basketData = await shoppingPlatform.viewBasket();
        setBasket(basketData.items);
        setTotalAmount(basketData.totalAmount.toString());
      }
    } catch (error) {
      setMessage("Error fetching basket: " + (error.message || error));
    }
  };

  const addToBasket = async (itemName, price, quantity) => {
    setMessage("");
    if (shoppingPlatform) {
      try {
        let tx = await shoppingPlatform.addToBasket(itemName, price, quantity);
        await tx.wait();
        viewBasket();
        setMessage("Item added to basket successfully!");
      } catch (error) {
        setMessage("Unable to add item to basket: User rejected transaction");
      }
    }
  };
  
  const buy = async () => {
    setMessage("");
  
    if (!ethWallet) {
      setMessage("MetaMask wallet is required to make a purchase.");
      return;
    }
  
    try {
      const gasLimit = 300000; // Example gas limit, adjust as necessary
  
      const tx = await shoppingPlatform.buy({
        value: ethers.utils.parseEther(totalAmount),
        gasLimit: ethers.BigNumber.from(gasLimit),
      });
  
      setMessage("Waiting for transaction to complete...");
      const receipt = await tx.wait();
  
      if (receipt.status === 0) {
        setMessage("Transaction Failed: " + receipt.transactionHash);
      } else {
        viewBasket();
        setMessage("Purchase completed successfully!");
      }
    } catch (error) {
      if (error.code === "ACTION_REJECTED") {
        setMessage("Transaction Failed: User rejected transaction.");
      } else if (error.data?.message.includes("Basket is empty")) {
        setMessage("No items in the basket to purchase.");
      } else {
        setMessage("Unable to complete purchase: " + (error.message || error));
      }
    }
  };
  
  
  const cancelOrder = async () => {
    setMessage("");
  
    if (!ethWallet) {
      setMessage("MetaMask wallet is required to cancel an order.");
      return;
    }
  
    try {
      const gasLimit = 100000; // Example gas limit, adjust as necessary
  
      const tx = await shoppingPlatform.cancelOrder({
        gasLimit: ethers.BigNumber.from(gasLimit),
      });
  
      setMessage("Waiting for transaction to complete...");
      await tx.wait();
  
      viewBasket();
      setMessage("Order cancelled successfully!");
    } catch (error) {
      if (error.code === "ACTION_REJECTED") {
        setMessage("Transaction Failed: User rejected transaction.");
      } else {
        setMessage("Unable to cancel order: " + (error.message || error));
      }
    }
  };
  
  

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this shopping platform.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>Connect MetaMask Wallet</button>
      );
    }

    if (basket.length === 0 && totalAmount === 0) {
      viewBasket();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Total Amount: {ethers.utils.formatEther(totalAmount)} ETH</p>
        <div className="button-container">
          <button onClick={() => addToBasket("Item1", ethers.utils.parseEther("0.01"), 1)}>Add Item1 (0.01 ETH)</button>
          <button onClick={buy}>Buy</button>
          <button onClick={cancelOrder}>Cancel Order</button>
        </div>
        {message && <p><strong>{message}</strong></p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Aditi Shopping Mart</h1>
      </header>
      {initUser()}
      <style jsx>{`
.container {
  text-align: center;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #333;
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
  background-image: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}

header h1 {
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  color: #fff;
}

.button-container {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 15px 30px;
  font-size: 18px;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  max-width: 300px;
  width: 100%;

  /* Gradient background */
  background-image: linear-gradient(45deg, #6a11cb 0%, #2575fc 100%);

  /* Box shadow for depth */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  /* Text shadow for readability */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
  background-image: linear-gradient(45deg, #2575fc 0%, #6a11cb 100%);
}

p {
  margin: 10px 0;
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: bold;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

`}</style>
    </main>
  );
}
