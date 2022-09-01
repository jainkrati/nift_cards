import {Alchemy, Network} from "alchemy-sdk";
import './App.css';
import cardImage from "./NIFT.png"

import { ethers } from "ethers";
import styled from "styled-components";
import React, { useEffect, useState } from "react";

const niftABI = require("./contract/ABI.json");
//import "dotenv/config";

const theme = {
  blue: {
    default: "#3f51b5",
    hover: "#283593"
  },
  pink: {
    default: "#e91e63",
    hover: "#ad1457"
  }
};

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

Button.defaultProps = {
  theme: "blue"
};

function App() {

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null)
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState(0);
  const [log,setLog] = useState("");
  const [nftList, setNftList] = useState(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any"); 
  const signer = provider.getSigner();
  const NIFT_CONTRACT_ADDRESS = "0xEfab89eC16Abf250b7231270299A3f27D949B15d";
  const niftContract = new ethers.Contract(NIFT_CONTRACT_ADDRESS, niftABI, signer);
  const config = {
    apiKey: 'WZaU55w9LFOHl43mSJKoLulGxNOBGnR0',
    network: Network.ETH_RINKEBY,
  };
  const alchemy = new Alchemy(config);      

  function connectWallet() {
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
    } else {
      alert("install metamask extension!!");
    }
  }
  
  const getBalance = (address) => {
    // Requesting balance method
    window.ethereum
      .request({ 
        method: "eth_getBalance", 
        params: [address, "latest"] 
      })
      .then((balance) => {
        // Setting balance
        setBalance(ethers.utils.formatEther(balance));
      });
  };
  
  // Function for getting handling all events
  const accountChangeHandler = (account) => {
    // Setting an address data
    setAddress(account);
    // Setting a balance
    getBalance(account);
    alchemy.nft.getNftsForOwner("0x44AC194359fA44eCe6Cb2E53E8c90547BCCb95a0").then(setNftList);
  };

  const renderFormView = () =>{
    return (
      <header className="App-header">
        {address === "" ? (
          <Button onClick={connectWallet} variant="primary">
            Connect to wallet
          </Button>
        ) : (
          <div className="Account-details">
            <label>Address: {address}</label>
            <br />
            <label>Balance: {balance}</label>
          </div>
        )}

        <div className="App-title">Gift a voucher using NIFT cards</div>
        <p></p>
        <div className="Voucher-creation-form">
          <label>
            Receiver's Ethereum Address:
            <input
              type="text"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
            />
          </label>
          <p></p>
          <label>
            Gift Token Amount (in wei):
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <p></p>
          <label>
            Message:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <p></p>
          <Button onClick={createVoucher}>Submit</Button>
          {log === "" ? (
            <label></label>
          ) : (
            <p>
              <a
                className="Tx-log"
                rel="noopener noreferrer"
                target="_blank"
                href={log}
              >
                Tx link
              </a>
            </p>
          )}
        </div>
      </header>
    );
  }

  async function redeemNFT(event){
    const tokenId = event.target.value;
    alert(tokenId);
    console.log("Redeeming voucher");
    let txReceipt = await niftContract.redeemVoucher(tokenId);
    const link = "https://rinkeby.etherscan.io/tx/"+txReceipt.hash;
    console.log(link);
    setLog(link);
    let result = await txReceipt.wait(1)
    console.log(result);
  }

  function niftOnly(nft) {
    return nft.contract.address.toLowerCase() === NIFT_CONTRACT_ADDRESS.toLowerCase();
  }

  const renderListView=()=>{
    console.log(nftList.ownedNfts);
    const allNFTs = nftList.ownedNfts;

    const vouchers = allNFTs.filter(niftOnly).map((nft) => 
      <div class="grid-item" onClick={redeemNFT} value={nft.tokenId}>
      <label className="nftDetails">{nft.tokenId}.{nft.description}</label><br/>
      <img className="cardImage" src={cardImage}/>
      </div>
    );

    return(
      <div>
      <h3>Choose a NIFT NFT to redeem:</h3>
      <div class="grid-container">{vouchers}</div>
      </div>

    );
  }

  const buttonOneClicked =()=>{
    console.log("Button 1 clicked")
    setMode(0);
  }

  const buttonTwoClicked =()=>{
    console.log("Button 2 clicked")
    setMode(1);
  }
 

  async function createVoucher(){
    console.log("creating voucher");
    let txReceipt = await niftContract.mint(description, amount, receiverAddress, { value: ethers.utils.formatUnits(amount, "wei") });
    const link = "https://rinkeby.etherscan.io/tx/"+txReceipt.hash;
    console.log(link);
    setLog(link);
    let result = await txReceipt.wait(1)
    console.log(result);
  }

  return (
    <div className="App">
      <Button onClick={() => buttonOneClicked()}>Create Voucher</Button>
      <Button onClick={() => buttonTwoClicked()}>Redeem Voucher</Button>
      {mode === 0 ? renderFormView() : renderListView() }
    </div>
  );
}

export default App;
