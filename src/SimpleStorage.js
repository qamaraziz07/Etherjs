import React, { useCallback, useState } from "react";
import { ethers } from "ethers";

const SimpleStorage = () => {

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState("");
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPrivateKey, setPrivateKey] = useState("");
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState("null");

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const sendEther = async () => {
    let network = "rinkeby";
    let provider = ethers.getDefaultProvider(network);
    let privateKey = walletPrivateKey;
    let wallet = new ethers.Wallet(privateKey, provider);
    let receiverAddress = walletAddress;
    let amountInEther = amount;
    let tx = {
      to: receiverAddress,
      value: ethers.utils.parseEther(amountInEther),
    };
    await wallet.sendTransaction(tx).then((txObj) => {
      console.log("txObj.hash", txObj);
    });
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const getBalance = useCallback(async () => {
    const network = "rinkeby";
    const provider = ethers.getDefaultProvider(network);
    const address = defaultAccount;
    provider.getBalance(address).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance);
      setBalance(balanceInEth);
      console.log(`balance: ${balanceInEth} ETH`);
    });
  }, [defaultAccount, balance]);

  //   const getCurrentVal = async () => {
  //     let val = await contract.get();
  //     console.log(val, "val");
  //     setCurrentContractVal(val);
  //   };

  return (
    <div className=" w-6/12 text-center m-auto">
      <div className=" flex justify-end items-end">
        <button
          className=" cursor-pointer w-40 p-2 rounded-lg bg-green-600 text-white font-bold m-3"
          onClick={connectWalletHandler}
        >
          {connButtonText}
        </button>
      </div>
      <div className=" bg-green-200 w-full m-3 p-3 ">
        <h3 className=" text-center mx-3 font-mono font-bold">
          Address: {defaultAccount ?? null}
        </h3>
      </div>

      <div className=" bg-blue-200 w-full flex justify-between items-center m-3 p-3 ">
        <h3 className=" text-left mx-3 font-mono font-bold">
          Balance: {balance || 0}
        </h3>
        <button
          className={`cursor-pointer w-40 p-2 rounded-lg bg-blue-600 text-white font-bold m-1 ${
            !defaultAccount && "cursor-not-allowed"
          }`}
          onClick={getBalance}
          disabled={!defaultAccount}
        >
          Get Balance
        </button>
      </div>
      <div className=" bg-orange-200 w-full flex items-center m-3 p-3 ">
        <h3 className=" text-left mx-3 font-mono font-bold w-40">
          Private Key:
        </h3>
        <input
          type="password"
          className=" bg-gray-100 p-2 border border-orange-400 rounded-lg w-full"
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Private key"
        />
      </div>
      <div>
        <div className=" bg-orange-200 w-full flex items-center m-3 p-3 ">
          <h3 className=" text-left mx-3 font-mono font-bold w-40">
            Receiver Address:
          </h3>
          <input
            type="text"
            className=" bg-gray-100 p-2 border border-orange-400 rounded-lg w-full"
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Reciever key"
          />
        </div>
        <div className=" bg-orange-200 w-full flex items-center m-3 p-3 ">
          <h3 className=" text-left mx-3 font-mono font-bold w-40">
            Ether Amount:
          </h3>
          <input
            type="text"
            className=" bg-gray-100 p-2 border border-orange-400 rounded-lg w-full"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            value={amount}
          />
        </div>
      </div>
      <button
        className={`cursor-pointer w-40 p-2 rounded-lg bg-orange-500 text-white font-bold m-1 ${
          !walletAddress && " cursor-not-allowed"
        }`}
        onClick={sendEther}
      >
        Send Ether
      </button>
    </div>
  );
};

export default SimpleStorage;
