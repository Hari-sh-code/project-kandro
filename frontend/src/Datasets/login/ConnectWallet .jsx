import React, { useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

const ConnectWallet = ({ onConnect }) => {
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        onConnect();
        navigate("/");
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else {
      alert("MetaMask not detected. Please install it.");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <button
        className="w-full max-w-md border-2 border-slate-800 py-3 text-slate-800 rounded-lg hover:text-slate-600 font-bold hover:border-slate-600"
        onClick={connectWallet}
      >
        Connect MetaMask
      </button>
    </div>
  );
};

export default ConnectWallet;
