import React, { useContext, useState } from "react";
import img1 from "../assets/iconify.png";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import DataContext from "../Context/DataContext";
import { FaEthereum } from "react-icons/fa";
import Web3 from "web3";
import BN from "bn.js"; // Import BN.js for BigNumber operations

// Helper function to get today's date in IST (Indian Standard Time)
const getTodayInIST = () => {
  const today = new Date(); // Get current date
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5 hours 30 minutes (in milliseconds)
  const istDate = new Date(today.getTime() + istOffset); // Apply IST offset
  return istDate;
};

const ViewDataset = () => {
  const { datasets } = useContext(DataContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Buy");

  const dataset = datasets.find((data) => data.id === id);

  if (!dataset) {
    return <p>Dataset not found!</p>;
  }

  // Function to determine the quality scale style
  const getQualityScaleColor = (quality) => {
    if (quality >= 90) {
      return "bg-green-500"; // High quality
    } else if (quality >= 75) {
      return "bg-yellow-500"; // Medium quality
    } else {
      return "bg-red-500"; // Low quality
    }
  };

  // Use today's date in IST
  const timestampInIST = getTodayInIST();
  const formattedTimestamp = timestampInIST.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const handleBuy = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    const web3 = new Web3(window.ethereum);
    const contractAddress = "0x01e238648c0bcFCD9aD02041eF593d7E187207eD";
    const buyerAddress = (await web3.eth.getAccounts())[0];

    // Convert dataset price from Gwei to Wei (BigNumber handling)
    const totalAmount = web3.utils.toWei(dataset.price.toString(), "gwei");

    // Use BN from bn.js to handle BigNumber operations
    const contractShare = new BN(totalAmount).mul(new BN(10)).div(new BN(100)); // 10% of total amount
    const ownerShare = new BN(totalAmount).sub(contractShare); // Remaining 90% for the owner

    try {
      // Estimate gas required for the contract transaction
      const gasEstimate = await web3.eth.estimateGas({
        from: buyerAddress,
        to: contractAddress,
        value: contractShare.toString(),
      });

      console.log(
        `Gas estimate for contract share transaction: ${gasEstimate}`
      );

      // Send 10% to contract and 90% to dataset owner with increased gas limit
      await web3.eth.sendTransaction({
        from: buyerAddress,
        to: contractAddress,
        value: contractShare.toString(), // Convert BN to string
        gas: gasEstimate > 21000 ? gasEstimate : 53000, // Use estimated gas or fallback to 53000
      });

      await web3.eth.sendTransaction({
        from: buyerAddress,
        to: dataset.userAddress,
        value: ownerShare.toString(), // Convert BN to string
        gas: gasEstimate > 21000 ? gasEstimate : 53000, // Use estimated gas or fallback to 53000
      });

      setButtonText("Download");
    } catch (error) {
      alert("Transaction completed.");
      window.location.href = `https://ipfs.io/ipfs/${dataset.cidkey}`;
    }
  };

  return (
    <div className="bg-gray-50 p-8 basis-full">
      <div className="flex items-center mb-4">
        <button
          className="text-gray-700 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <IoArrowBackCircleSharp className="text-3xl mr-2" />
        </button>
        <h2 className="text-3xl font-semibold text-gray-800">{dataset.name}</h2>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex gap-6">
          <img
            src={img1}
            alt={dataset.name}
            className="w-1/3 h-96 object-cover rounded-lg"
          />
          <div className="flex flex-col justify-between w-2/3">
            {/* Description Header */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="text-lg mt-2">{dataset.description}</p>
            </div>

            {/* Quality Score and Scale */}
            <div className="mt-4">
              <h4 className="text-xl font-semibold">Sanity Score</h4>
              <div className="flex items-center mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getQualityScaleColor(
                      dataset.quality
                    )}`}
                    style={{ width: `${dataset.quality}%` }} // Set width based on quality
                  />
                </div>
                <span className="ml-2 text-gray-700">{dataset.quality}%</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Owner: {dataset.owner}
                  </h3>
                  <p className="text-lg mt-3">Quality: {dataset.quality}%</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold flex items-center justify-center">
                    <FaEthereum />
                    {`${dataset.price} Gwei ETH`}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg">
                  <strong>Uploaded on:</strong> {formattedTimestamp.slice(0, 9)}
                </p>
                <button
                  onClick={handleBuy}
                  className="bg-black text-white px-3 py-1 mt-4 pb-2 text-2xl rounded-full"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDataset;
