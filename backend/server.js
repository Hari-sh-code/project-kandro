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
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
app.use(express.json());

// Enable CORS for all routes
app.use(cors());
mongoose.connect("mongodb://localhost:27017/discussionDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const topicSchema = new mongoose.Schema({
  name: String,
  createdBy: String,
  messages: [messageSchema],
});

const Topic = mongoose.model("Topic", topicSchema);

// Routes

// Fetch topics created by the current user
app.get("/api/topics/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const topics = await Topic.find({ createdBy: userId });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new topic
app.post("/api/topics", async (req, res) => {
  const { name, createdBy } = req.body;
  try {
    const newTopic = new Topic({ name, createdBy, messages: [] });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a message to a topic
app.post("/api/topics/:id/messages", async (req, res) => {
  const { id } = req.params;
  const { sender, text } = req.body;
  try {
    const topic = await Topic.findById(id);
    if (topic) {
      topic.messages.push({ sender, text });
      await topic.save();
      res.status(201).json(topic);
    } else {
      res.status(404).json({ error: "Topic not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End a discussion
app.delete("/api/topics/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const topic = await Topic.findByIdAndDelete(id);
    if (topic) {
      res.status(200).json({ message: "Discussion ended" });
    } else {
      res.status(404).json({ error: "Topic not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
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
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(uploadDir, req.file.filename);

    // Spawn a Python process to run the quality-check script
    const pythonProcess = spawn(process.env.PYTHON_PATH || "python", [
      "calculate_quality1.py",
      filePath,
    ]);

    let result = "";
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python error: ${data.toString()}`);
      res
        .status(500)
        .json({ error: "Error in Python script", details: data.toString() });
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          // Parse the JSON output from Python
          const response = JSON.parse(result);

          // Check if the response is successful
          if (response.status === "success") {
            res.json(response); // Send the result as JSON back to the frontend
          } else {
            res.status(500).json({
              error: "Error from Python script",
              message: response.message,
            });
          }
        } catch (err) {
          console.error("Error parsing JSON from Python:", err);
          res.status(500).json({
            error: "Error parsing JSON from Python",
            details: err.message,
          });
        } finally {
          fs.unlinkSync(filePath); // Clean up the uploaded file
        }
      } else {
        console.error("Python script failed with code:", code);
        res.status(500).json({ error: "Error calculating data quality", code });
      }
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res
      .status(500)
      .json({ error: "Error processing file", details: error.message });
  }
});

// Endpoint to upload file to Pinata (if needed)
app.post("/api/upload-to-pinata", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Prepare FormData for Pinata
  const form = new FormData();
  form.append("file", fs.createReadStream(file.path));

  // Headers for Pinata request (use environment variables for API keys)
  const headers = {
    ...form.getHeaders(),
    pinata_api_key: "e414f68867a6d6731055", // Use environment variables
    pinata_secret_api_key:
      "e2f8c6fdb791e18c081da9a4fb73ebfdfef3144e1bf54f7b5b4e5be94cdac9b6", // Use environment variables
  };

  // Make the API request to Pinata
  axios
    .post("https://api.pinata.cloud/pinning/pinFileToIPFS", form, {
      headers: headers,
    })
    .then((response) => {
      // Send back the IPFS CID from Pinata
      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        cid: response.data.IpfsHash, // Pinata's response contains the CID (hash)
      });
    })
    .catch((error) => {
      console.error("Error uploading to Pinata:", error);
      res.status(500).json({
        error: "Error uploading to Pinata",
        details: error.response ? error.response.data : error.message,
      });
    })
    .finally(() => {
      // Cleanup uploaded file after Pinata upload
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Error deleting file after upload:", err);
      }
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
