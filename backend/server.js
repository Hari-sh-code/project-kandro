const express = require('express');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { Web3Storage, File } = require('web3.storage');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

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

// Initialize Web3Storage client with API key
const client = new Web3Storage({ token: process.env.WEB3_STORAGE_API_KEY });

// Endpoint to receive file and respond with quality
app.post('/api/data-quality-check', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.join(uploadDir, req.file.filename);

        // Spawn Python process to calculate quality
        const pythonProcess = spawn('python3', ['calculate_quality.py', filePath]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const response = JSON.parse(result);
                    res.json(response);
                    fs.unlinkSync(filePath);
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
});

// Endpoint to get hash code of uploaded CSV file
app.post('/api/get-hash-code', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.join(uploadDir, req.file.filename);

        const fileStream = fs.createReadStream(filePath);
        const hash = crypto.createHash('sha256');

        fileStream.on('data', (chunk) => {
            hash.update(chunk);
        });

        fileStream.on('end', () => {
            const hashCode = hash.digest('hex');
            res.json({ hashCode });
            fs.unlinkSync(filePath);
        });

        fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            res.status(500).json({ error: 'Error reading file' });
        });

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error processing file' });
    }
});

// Endpoint to upload CSV file to Web3.Storage and retrieve CID
app.post('/api/upload-to-ipfs', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.join(uploadDir, req.file.filename);
        const file = new File([fs.readFileSync(filePath)], req.file.originalname);

        // Upload the file to Web3.Storage and get the CID
        const cid = await client.put([file]);

        // Send the CID back in the response
        res.json({ cid });

        // Optionally, delete the file from the server after uploading to Web3.Storage
        fs.unlinkSync(filePath);

    } catch (error) {
        console.error('Error uploading to Web3.Storage:', error);
        res.status(500).json({ error: 'Error uploading file to Web3.Storage' });
    }
});

// Endpoint to upload file to Pinata and get CID
app.post('/api/upload-to-pinata', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.join(uploadDir, req.file.filename);
        const fileStream = fs.createReadStream(filePath);

        const formData = new FormData();
        formData.append('file', fileStream);

        const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxBodyLength: 'Infinity', // Allow large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_API_SECRET,
            },
        });

        const { IpfsHash } = pinataResponse.data;

        res.json({ cid: IpfsHash });

        fs.unlinkSync(filePath);

    } catch (error) {
        console.error('Error uploading to Pinata:', error);
        res.status(500).json({ error: 'Error uploading file to Pinata' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


app.post('/api/data-quality-check', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.join(uploadDir, req.file.filename);

        // Spawn Python process to calculate quality
        const pythonProcess = spawn('python3', ['calculate_quality.py', filePath]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const response = JSON.parse(result);
                    res.json(response);
                    fs.unlinkSync(filePath);
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
});