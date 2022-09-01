import {Alchemy, Network} from "alchemy-sdk";
import './App.css';

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
  const [showForm1, setShowForm1] = useState(false);
  const [showList2, setShowList2] = useState(false);
  const [log,setLog] = useState("");
  const network="rinkeby";
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any"); 
//   const provider = ethers.getDefaultProvider(network, {
//     alchemy: 'NY6OVEVWvAeCaXd4L1cPEiM0y_W_tFD0',
// });

  const signer = provider.getSigner();
  const niftContract = new ethers.Contract("0xEfab89eC16Abf250b7231270299A3f27D949B15d", niftABI, signer);

  useEffect(() => {
    // const address = "elanhalpern.eth";
    console.log(signer, signer.provider ,Object.keys(signer.provider.provider))
    getNfts(signer)
    
  }, []);

  const getNfts=(signer)=>{
    const baseURL = "https://eth-rinkeby.alchemyapi.io/v2/NY6OVEVWvAeCaXd4L1cPEiM0y_W_tFD0";
    const url = `${baseURL}/getNFTs/?owner=${address}`;
    console.log(address)
    var requestOptions = {
      method: "get",
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => {
        const nfts = response["data"];

        // Parse output
        const numNfts = nfts["totalCount"];
        const nftList = nfts["ownedNfts"];

        console.log(`Total NFTs owned by ${address}: ${numNfts} \n`);

        let i = 1;

        console.log(nfts,nftList)
      })
      .catch((error) => console.log("error", error));
  }

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
            <text>Address: {address}</text>
            <br />
            <text>Balance: {balance}</text>
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

  const config = {
    apiKey: 'yuMjdZzH7AjXXFZfrSnI-v6NUXuFyzx8',
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);      
  

  const renderListView=()=>{
    return(
      <h3>Your NFTs</h3>

      
        // Wallet address
        //const address = "elanhalpern.eth";
      
        // Get all NFTs
        
        //console.log(`Total NFTs owned by ${address}: ${numNfts} \n`);
      
        // let i = 1;
      
        // for (let nft of nftList) {
        //   console.log(`${i}. ${nft.title}`);
        //   i++;
        // }
      




    )
  }

  const buttonOneClicked =()=>{
    console.log("Button 1 clicked")
    setShowForm1(true)
    setShowList2(false)
  }

  const buttonTwoClicked =()=>{
    console.log("Button 2 clicked")
    setShowForm1(false)
    setShowList2(true)
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

  console.log(showForm1,showList2)
  return (
    <div className="App">
      <Button onClick={() => buttonOneClicked()}>Create Voucher</Button>
      <Button onClick={() => buttonTwoClicked()}>Redeem Voucher</Button>
      {showForm1 ? renderFormView() : ''}
      {showList2 ? renderListView() : ''}
    </div>
  );
}

export default App;
