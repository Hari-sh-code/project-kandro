require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { spawn } = require("child_process");
const app = express();
const PORT = 9000;

// Enable CORS for all routes
app.use(cors());

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file uploads
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Only CSV files are allowed"), false);
    }
    cb(null, true);
  },
});

// Data Quality Check endpoint (calls Python script for analysis)
app.post("/api/data-quality-check", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(uploadDir, req.file.filename);

  // Spawn Python process to calculate quality
  const pythonProcess = spawn(process.env.PYTHON_PATH || "python", [
    "calculate_quality.py",
    filePath,
  ]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.on("close", (code) => {
    console.log("Python script exited with code:", code);
    if (code === 0) {
      try {
        const response = JSON.parse(result);
        console.log("Python script response:", response); // Log the response here

        if (response.status === "success") {
          // Ensure the mean_quality_score is sent back in the response
          res.json({
            status: "success",
            mean_quality_score: response.mean_quality_score,
            message: "Data quality check completed successfully",
          });
        } else {
          res
            .status(500)
            .json({
              error: "Error from Python script",
              message: response.message,
            });
        }
      } catch (err) {
        console.error("Error parsing JSON from Python:", err);
        res
          .status(500)
          .json({
            error: "Error parsing JSON from Python",
            details: err.message,
          });
      }
      fs.unlinkSync(filePath); // Cleanup the uploaded file after processing
    } else {
      console.error("Python script failed with code:", code);
      res.status(500).json({ error: "Error calculating data quality", code });
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
    res
      .status(500)
      .json({ error: "Error in Python script", details: data.toString() });
  });
});

app.post("/api/upload-to-pinata", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file uploaded.");
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Log the uploaded file details
    console.log("Uploaded file details:", req.file);

    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataApiSecret = process.env.PINATA_API_SECRET;

    // Prepare form data for Pinata API
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    // Pinata API URL
    const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    // Set headers including Pinata API keys
    const headers = {
      ...form.getHeaders(),
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataApiSecret,
    };

    console.log("Sending file to Pinata...");

    // Send file to Pinata
    const response = await axios.post(pinataUrl, form, { headers });

    if (response.data && response.data.IpfsHash) {
      console.log("Pinata Response:", response.data);
      return res.json({ cid: response.data.IpfsHash });
    } else {
      console.error(
        "Failed to get IpfsHash from Pinata response:",
        response.data
      );
      return res
        .status(500)
        .json({ error: "Failed to upload file to Pinata." });
    }
  } catch (error) {
    console.error("Error during Pinata upload:", error);
    return res
      .status(500)
      .json({
        error: "An error occurred during the upload process.",
        details: error.message,
      });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
