const express = require('express');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');  // Import child_process to run Python scripts
const app = express();
const PORT = 9000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

// Endpoint to receive the file and respond with quality
app.post('/api/data-quality-check', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`File received for quality check: ${req.file.originalname}`);

        // Get the file path
        const filePath = path.join(__dirname, 'uploads', req.file.filename);

        // Spawn Python process to calculate quality
        const pythonProcess = spawn('python3', ['calculate_quality.py', filePath]);

        // Capture output from the Python script
        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        // Handle script completion
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                const response = JSON.parse(result);  // Parse the JSON result
                res.json(response);

                // Optionally delete the uploaded file after processing
                fs.unlinkSync(filePath);
            } else {
                res.status(500).json({ error: 'Error calculating data quality' });
            }
        });

        // Handle errors in the Python script
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

        console.log(`File received for hash code generation: ${req.file.originalname}`);

        // Get the file path
        const filePath = path.join(__dirname, 'uploads', req.file.filename);

        // Create a readable stream from the uploaded file
        const fileStream = fs.createReadStream(filePath);

        // Create a hash object using SHA256
        const hash = crypto.createHash('sha256');

        // Update the hash with file data
        fileStream.on('data', (chunk) => {
            hash.update(chunk);
        });

        // Once the file is fully read, calculate the hash
        fileStream.on('end', () => {
            const hashCode = hash.digest('hex'); // Get the hash code in hexadecimal format
            res.json({
                hashCode,  // Send the hash code in response
                message: 'File hash generated successfully',
            });

            // Optionally delete the file after generating the hash
            fs.unlinkSync(filePath);
        });

        // Handle file reading errors
        fileStream.on('error', (err) => {
            res.status(500).json({ error: 'Error reading the file' });
            console.error('File stream error:', err);
        });
    } catch (error) {
        console.error('Error generating hash:', error);
        res.status(500).json({ error: 'Error generating hash' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
