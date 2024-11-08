// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { ethers } = require("ethers"); // Import ethers library

const app = express();
const PORT = 9000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Configure multer to save uploaded files to a temporary directory
const upload = multer({ dest: "uploads/" });

// Ethereum provider and wallet configuration
const provider = new ethers.providers.Web3Provider(window.ethereum); // Replace with your Alchemy URL

const wallet = new ethers.Wallet(
  "31e03fec28c225d9e20a433d5462293500b6756b277c3beb100ca62b422b4905",
  provider
); // Replace with your private key

// Smart contract address and ABI
const contractAddress = "0x8C9C95A830b7E7e86f2f12DB88e911499A6f695f"; // Replace with your contract address
const contractABI = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_owner", type: "string" },
      { internalType: "uint256", name: "_quality", type: "uint256" },
      { internalType: "uint256", name: "_rating", type: "uint256" },
      { internalType: "uint256", name: "_price", type: "uint256" },
      { internalType: "string", name: "_coverImg", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
    ],
    name: "addDataset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "datasetCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "getDataset",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "owner", type: "string" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "uint256", name: "quality", type: "uint256" },
      { internalType: "uint256", name: "rating", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "string", name: "coverImg", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Create contract instance
const datasetContract = new ethers.Contract(
  contractAddress,
  contractABI,
  wallet
);

// Endpoint to receive the file and respond with quality
app.post("/api/data-quality-check", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`File received: ${req.file.originalname}`);

    // Perform any necessary processing on the file here (e.g., validation, parsing)
    const qualityScore = 80; // Mocked quality score, replace with actual logic
    res.json({ quality: qualityScore });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  }
});

// Endpoint to store dataset information on blockchain
app.post("/api/store-dataset", async (req, res) => {
  try {
    const { name, owner, quality, rating, price, coverImg, description } =
      req.body;

    // Validate the input
    if (
      !name ||
      !owner ||
      !quality ||
      !rating ||
      !price ||
      !coverImg ||
      !description
    ) {
      return res
        .status(400)
        .json({ error: "Missing required dataset information" });
    }

    console.log("Storing dataset on blockchain...");

    // Interact with the smart contract to store dataset information
    const tx = await datasetContract.addDataset(
      name,
      owner,
      quality,
      rating,
      price,
      coverImg,
      description
    );
    await tx.wait(); // Wait for transaction to be mined

    res.json({ message: "Dataset stored successfully on blockchain" });
  } catch (error) {
    console.error("Error storing dataset on blockchain:", error);
    res.status(500).json({ error: "Error storing dataset on blockchain" });
  }
});

// Endpoint to retrieve dataset information from blockchain
app.get("/api/block-info", async (req, res) => {
  try {
    const datasetCount = await datasetContract.getDatasetCount();
    const datasets = [];

    for (let i = 1; i <= datasetCount; i++) {
      const dataset = await datasetContract.getDataset(i);
      datasets.push({
        id: dataset.id.toString(),
        name: dataset.name,
        owner: dataset.owner,
        time: new Date(dataset.timestamp.toNumber() * 1000).toISOString(),
        quality: dataset.quality.toNumber(),
        rating: dataset.rating.toNumber(),
        price: ethers.utils.formatUnits(dataset.price, "ether"),
        coverImg: dataset.coverImg,
        description: dataset.description,
      });
    }

    res.json(datasets);
  } catch (error) {
    console.error("Error retrieving datasets from blockchain:", error);
    res
      .status(500)
      .json({ error: "Error retrieving datasets from blockchain" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
