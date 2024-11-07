const express = require('express');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 9000;

// Enable CORS for all routes
app.use(cors());

// Configure multer to save uploaded files to a temporary directory
const upload = multer({ dest: 'uploads/' });

// Endpoint to receive the file and respond with quality
app.post('/api/data-quality-check', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`File received: ${req.file.originalname}`);

        // Perform any necessary processing on the file here (e.g., validation, parsing)
        // For now, we're just responding with a fixed quality value as requested

        const qualityScore = 80; // Mocked quality score
        res.json({ quality: qualityScore });
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
        const hash = crypto.createHash('sha256'); // You can use 'md5', 'sha512', etc.

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
