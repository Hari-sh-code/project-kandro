import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from 'axios';
import Web3 from "web3";
import { FaEthereum } from "react-icons/fa";

export function UploadData() {
    const [file, setFile] = useState(null);
    const [dataQuality, setDataQuality] = useState(null);
    const [datasetType, setDatasetType] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [ethPrice, setEthPrice] = useState("");  // New state for ETH price
    const [qualityChecked, setQualityChecked] = useState(false);
    const [nextStep, setNextStep] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [thumbnailUploaded, setThumbnailUploaded] = useState(false);
    const [isThumbnailTooLarge, setIsThumbnailTooLarge] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileUploaded(true);
    };
    const handleQualityCheck = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
    
            try {
                const response = await axios.post("http://localhost:9000/api/data-quality-check", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log("Full response:", response);
                console.log("Response data:", response.data); // Log to inspect structure
                console.log("Quality field:", response.data.quality);  // Confirm correct field name
                const qualityData = response.data;
                setDataQuality(qualityData.quality); // Adjust path if needed
                setQualityChecked(true);
            } catch (error) {
                console.error("Error fetching data quality:", error);
            }
        }
    };
    


    const handleThumbnailChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > 20480) {
            alert("Please select an image less than 20 KB.");
            setThumbnail(null);
            setThumbnailUploaded(false);
            setIsThumbnailTooLarge(true);
        } else {
            setThumbnail(selectedFile);
            setThumbnailUploaded(true);
            setIsThumbnailTooLarge(false);
        }
    };

    const handleSubmit = async () => {
        if (!dataQuality) {
            console.error("Data quality is not set. Please check data quality before uploading.");
            return;  // Exit if dataQuality is not set
        }
    
        const currentDate = new Date().toISOString();
        let userAddress = "";
    
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                userAddress = accounts[0];
            } else {
                console.error("MetaMask address not found.");
            }
        }
    
        // Log each form field to verify data before uploading
        console.log("File:", file);
        console.log("Thumbnail:", thumbnail);
        console.log("Description:", description);
        console.log("Username:", "devak");
        console.log("User Address:", userAddress);
        console.log("Current Date:", currentDate);
        console.log("Dataset Type:", datasetType);
        console.log("Data Quality:", dataQuality); // Ensure dataQuality is set
        console.log("ETH Price:", ethPrice);
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("thumbnail", thumbnail);
        formData.append("description", description);
        formData.append("username", "devak");
        formData.append("hashcode",hashCode);
        formData.append("userAddress", userAddress);
        formData.append("currentDate", currentDate);
        formData.append("datasetType", datasetType);
        formData.append("dataQuality", dataQuality); // Include dataQuality here
        formData.append("ethPrice", ethPrice);
    
        try {
            const response = await axios.post("http://localhost:9000/api/upload-dataset", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log("Data uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading data:", error);
        }
    };
    


    const handleNext = async () => {
        try {
            const currentDate = new Date().toISOString();
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const userAddress = await web3.eth.getAccounts();
                if (userAddress && userAddress.length > 0) {
                    const address = userAddress[0];
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("userAddress", address);
                    formData.append("currentDate", currentDate);
                    formData.append("datasetType", datasetType);


                    const response = await axios.post("http://localhost:9000/api/get-hash-code", formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    console.log(response.data);
                    
                    setQualityChecked(true);
                    setNextStep(true);
                }
            } else {
                console.error("MetaMask is not installed.");
            }
        } catch (error) {
            console.error("Error fetching data quality:", error);
        }
    };

    return (
        <div className="flex justify-center items-center w-full min-h-screen">
            <div className="flex flex-col items-center p-10 shadow-lg rounded-lg w-full max-w-xl">
                <h2 className="text-4xl font-semibold mb-8">Upload Dataset</h2>

                <div className="w-full space-y-6">
                    {/* File Upload */}
                    <div>
                        <label className="block font-medium mb-2">CSV File</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className={`w-full p-3 border ${fileUploaded ? 'border-green-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:border-gray-500 transition`}
                        />
                        {!nextStep && (
                            <button
                                onClick={handleQualityCheck}
                                disabled={!file}
                                className="mt-3 bg-gray-700 text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-gray-600 transition cursor-pointer"
                            >
                                <FaCloudUploadAlt /> Check Quality
                            </button>
                        )}
                    </div>

                    {/* Data Quality Display */}
                    {qualityChecked && dataQuality && (
                        <div className="flex flex-col p-4 rounded-lg shadow-inner mb-4">
                            <div className="mb-2">
                                <strong>Data Quality:</strong> {dataQuality}
                            </div>
                            {!nextStep && (
                                <div>
                                    <h6>If you're happy with the score, click next to proceed</h6>
                                    <button onClick={handleNext} className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-600 text-white rounded-md">
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Additional Details (shown only after quality check and next step) */}
                    {nextStep && (
                        <>
                            <div>
                                <label className="block font-medium mb-2">Dataset Title</label>
                                <input
                                    type="text"
                                    value={datasetType}
                                    onChange={(e) => setDatasetType(e.target.value)}
                                    placeholder="Enter dataset type"
                                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter a short description"
                                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 transition"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Thumbnail Image <span className="text-sm text-slate-500">less than 20kb</span></label>
                                <input
                                    type="file"
                                    accept="image/jpg"
                                    onChange={handleThumbnailChange}
                                    className={`w-full p-3 border ${isThumbnailTooLarge ? 'border-red-500' : thumbnailUploaded ? 'border-green-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:border-gray-500 transition`}
                                />
                            </div>

                            {/* ETH Price Input */}
                            <div>
                                <label className="flex items-center font-medium mb-2"><FaEthereum/> <div>Gwei ETH Price</div></label>
                                <input
                                    type="number"
                                    value={ethPrice}
                                    onChange={(e) => setEthPrice(e.target.value)}
                                    placeholder="Enter Gwei ETH price"
                                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 transition"
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full py-3 mt-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition"
                            >
                                Upload
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
