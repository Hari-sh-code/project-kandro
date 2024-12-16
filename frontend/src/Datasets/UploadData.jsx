import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaEthereum } from "react-icons/fa";
import axios from "axios";
import Web3 from "web3";
import { MdReportProblem } from "react-icons/md";
import DatasetStorageABI from "../Context/DatasetStorageABI";

export function UploadData() {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");
  const [datasetTitle, setDatasetTitle] = useState("");
  const [username, setUsername] = useState("");
  const [ethPrice, setEthPrice] = useState("");
  const [form, setForm] = useState(false);
  const [dataQuality, setDataQuality] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [cidcode, setCidcode] = useState("");
  const [qualityChecked, setQualityChecked] = useState(false);
  const [nextStep, setNextStep] = useState(false);
  const [qualityWarning, setQualityWarning] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleQualityCheck = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://localhost:9000/api/data-quality-check",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const qualityData = response.data;
        setDataQuality(qualityData.mean_quality_score);
        setQualityChecked(true);

        // Check for malicious and fake data indicators
        if (qualityData.malicious_data_found || qualityData.fake_data_found) {
          setQualityWarning(
            "Warning: The data contains malicious or fake entries and cannot be uploaded."
          );
          setNextStep(false); // Hide the "Next" button
        } else {
          setQualityWarning(""); // Clear any warnings
          setNextStep(true); // Show the "Next" button
        }
      } catch (error) {
        console.error("Error fetching data quality:", error);
      }
    }
  };

  const handleNext = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();

        setUserAddress(accounts[0]);

        const formData = new FormData();
        formData.append("file", file);

        const pinataResponse = await axios.post(
          "http://localhost:9000/api/upload-to-pinata",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setCidcode(pinataResponse.data.cid);
        setNextStep(false); // Set the CID key
        setForm(true);
        console.log("File uploaded to Pinata:", pinataResponse.data.cid);
      } else {
        console.error("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
    }
  };

  const handleSubmit = async () => {
    if (!dataQuality) {
      console.error("Data quality not checked. Please check before uploading.");
      return;
    }

    const currentDate = new Date().toISOString();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("thumbnail", thumbnail);
    formData.append("description", description);
    formData.append("username", username);
    formData.append("userAddress", userAddress);
    formData.append("currentDate", currentDate);
    formData.append("dataQuality", dataQuality);
    formData.append("cidcode", cidcode); // Include the CID code
    formData.append("ethPrice", ethPrice);

    if (!userAddress) {
      alert("User address is not available. Please check MetaMask connection.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const contractAddress = import.meta.env.VITE_contractAddress;
      const contract = new web3.eth.Contract(
        DatasetStorageABI,
        contractAddress
      );

      console.log("Data to be uploaded:", {
        description,
        username,
        userAddress,
        dataQuality,
        cidcode,
        ethPrice: ethPrice.toString(),
      });

      const gasEstimate = await contract.methods
        .addDataset(
          datasetTitle,
          username,
          cidcode,
          dataQuality.toString(),
          ethPrice.toString(),
          description,
          userAddress
        )
        .estimateGas({ from: userAddress });

      const tx = await contract.methods
        .addDataset(
          datasetTitle,
          username,
          cidcode,
          dataQuality.toString(),
          ethPrice.toString(),
          description,
          userAddress
        )
        .send({ from: userAddress, gas: gasEstimate });

      console.log("Transaction successful:", tx);
      alert("Data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data to the blockchain:", error);
      alert("An error occurred while uploading data.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Upload Dataset
        </h2>

        <div className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-2">
              CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            {!nextStep && (
              <button
                onClick={handleQualityCheck}
                disabled={!file}
                className="mt-4 bg-slate-800 text-white px-4 py-2 rounded-md shadow hover:bg-slate-600 flex items-center gap-2 transition cursor-pointer"
              >
                <FaCloudUploadAlt /> Check Sanity
              </button>
            )}
          </div>

          {qualityChecked && (
            <div className="bg-blue-50 p-4 rounded-lg shadow-inner mb-4">
              <div className="text-lg text-blue-700">
                <strong>Data Sanity Score:</strong> {dataQuality}
              </div>
              {qualityWarning && (
                <div className="flex items-center gap-2 mt-2">
                  <MdReportProblem className="text-3xl text-red-700" />
                  <span className="text-red-600 font-semibold">
                    {qualityWarning}
                  </span>
                </div>
              )}
              {!qualityWarning && nextStep && (
                <button
                  onClick={handleNext}
                  className="mt-3 bg-slate-800 text-white px-4 py-2 rounded-md shadow hover:bg-slate-600"
                >
                  Next
                </button>
              )}
            </div>
          )}

          {form && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600">
                  Dataset Title
                </label>
                <input
                  type="text"
                  placeholder="Dataset Title"
                  onChange={(e) => setDatasetTitle(e.target.value)}
                  className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600">
                  Description
                </label>
                <textarea
                  placeholder="Dataset Description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="text-lg font-semibold text-gray-600 flex items-center gap-2">
                  <FaEthereum /> Gwei ETH
                </label>
                <input
                  type="number"
                  placeholder="Gwei ETH"
                  onChange={(e) => setEthPrice(e.target.value)}
                  className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-600">
                  Thumbnail Image{" "}
                  <span className="text-sm text-gray-500">
                    (less than 20kb)
                  </span>
                </label>
                <input
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full mt-4 bg-slate-800 text-white px-4 py-3 rounded-md shadow hover:bg-slate-600 transition"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
