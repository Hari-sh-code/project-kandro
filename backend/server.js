const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { spawn } = require('child_process');
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
        console.log('Python script exited with code:', code);
        if (code === 0) {
            try {
                const response = JSON.parse(result);
                if (response.status === 'success') {
                    res.json(response);
                } else {
                    res.status(500).json({ error: 'Error from Python script', message: response.message });
                }
                fs.unlinkSync(filePath); // Cleanup the uploaded file after processing
            } catch (err) {
                console.error('Error parsing JSON from Python:', err);
                res.status(500).json({ error: 'Error parsing JSON from Python', details: err.message });
            }
        } else {
            console.error('Python script failed with code:', code);
            res.status(500).json({ error: 'Error calculating data quality', code });
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
        res.status(500).json({ error: 'Error in Python script', details: data.toString() });
    });
});


// Endpoint to upload file to Pinata (if needed)
app.post('/api/upload-to-pinata', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Prepare FormData for Pinata
    const form = new FormData();
    form.append('file', fs.createReadStream(file.path));

    // Headers for Pinata request (use environment variables for API keys)
    const headers = {
        ...form.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
    };

    // Make the API request to Pinata
    axios
        .post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
            headers: headers,
        })
        .then((response) => {
            res.status(200).json({
                success: true,
                message: 'File uploaded successfully',
                cid: response.data.IpfsHash,
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
