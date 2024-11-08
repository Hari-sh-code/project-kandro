const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data'); // Correct import
const { spawn } = require('child_process'); // Make sure to import spawn for Python script execution
const app = express();
const PORT = 9000;

// Enable CORS for all routes
app.use(cors());

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up multer for file uploads
const upload = multer({
    dest: uploadDir,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv') {
            return cb(new Error('Only CSV files are allowed'), false);
        }
        cb(null, true);
    }
});

// Data Quality Check endpoint (calls Python script for analysis)
app.post('/api/data-quality-check', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.join(uploadDir, req.file.filename);

        // Spawn Python process to calculate quality
        const pythonProcess = spawn(process.env.PYTHON_PATH || 'python', ['calculate_quality.py', filePath]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const response = JSON.parse(result);
                    res.json(response);
                    fs.unlinkSync(filePath); // Cleanup after processing
                } catch (err) {
                    res.status(500).json({ error: 'Error parsing JSON from Python' });
                    console.error("Error parsing JSON from Python:", err);
                }
            } else {
                res.status(500).json({ error: 'Error calculating data quality' });
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python error: ${data}`);
            res.status(500).json({ error: 'Error in Python script' });
        });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error processing file' });
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

// Endpoint to upload file to Pinata
app.post('/api/upload-to-pinata', upload.single('file'), (req, res) => {
    const file = req.file;
  
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    // Prepare FormData for Pinata
    const form = new FormData();
    form.append('file', fs.createReadStream(file.path));
  
    // Headers for Pinata request
    const headers = {
      ...form.getHeaders(),
      pinata_api_key: "e414f68867a6d6731055",
      pinata_secret_api_key: "e2f8c6fdb791e18c081da9a4fb73ebfdfef3144e1bf54f7b5b4e5be94cdac9b6",
    };
  
    // Make the API request to Pinata
    axios
      .post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
        headers: headers,
      })
      .then((response) => {
        // Send back the IPFS CID from Pinata
        res.status(200).json({
          success: true,
          message: 'File uploaded successfully',
          cid: response.data.IpfsHash,  // Pinata's response contains the CID (hash)
        });
      })
      .catch((error) => {
        console.error('Error uploading to Pinata:', error);
        res.status(500).json({
          error: 'Error uploading to Pinata',
          details: error.response ? error.response.data : error.message,
        });
      })
      .finally(() => {
        fs.unlinkSync(file.path);  // Clean up the uploaded file after Pinata upload
      });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
