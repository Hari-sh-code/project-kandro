const express = require('express');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const PORT = 9000;

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
                    res.json(response);  // Send response only once
                    fs.unlinkSync(filePath);  // Optionally delete file
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
            fs.unlinkSync(filePath);  // Optionally delete file
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
