import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan'; // Import Morgan
import fs from 'fs';

// Use this for compatibility with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create a write stream (in append mode) to log HTTP requests
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Use Morgan to log HTTP requests
app.use(morgan('combined', { stream: accessLogStream }));

// Serve the static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8083;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
