import './App.css';

import { ethers } from "ethers";
import styled from "styled-components";
import React, { useState } from "react";

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

  const [address, setaddress] = useState(
    ""
  );
  const [balance, setbalance] = useState(
     null)

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
  
  const getbalance = (address) => {
    
    // Requesting balance method
    window.ethereum
      .request({ 
        method: "eth_getBalance", 
        params: [address, "latest"] 
      })
      .then((balance) => {
        // Setting balance
        setbalance(ethers.utils.formatEther(balance));
      });
  };
  
  // Function for getting handling all events
  const accountChangeHandler = (account) => {
    // Setting an address data
    setaddress(account);
  
    // Setting a balance
    getbalance(account);
  };

  return (
    <div className="App">
      <header className="App-header">
      {
            address ==="" ? <Button onClick={connectWallet} variant="primary">
            Connect to wallet
          </Button> : <div className="Account-details"><text>Address: {address}</text><br/><text>Balance: {balance}</text></div>
      } 
    
      <div className="App-title">Gift a voucher using NIFT cards</div>
      <p></p>
      <form>
  <label>
    Receiver's Ethereum Address:
    <input type="text" name="name" />
  </label>
  <p></p>
  <label>
    Gift Token Amount (in wei):
    <input type="text" name="name" />
  </label>
  <p></p>
  <label>
    Message:
    <input type="text" name="name" />
  </label>
  <p></p>
  <input className="submit" type="submit" value="Submit" />
</form>
      </header>
    </div>
  );
}

export default App;
