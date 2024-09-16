import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan'; // Import Morgan for logging
import fs from 'fs';
import https from 'https'; // HTTPS module
import http from 'http';   // HTTP module
import config from './config.json' assert { type: 'json' }; // Import configuration file

// Compatibility with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create a write stream (in append mode) to log HTTP requests
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Use Morgan to log HTTP requests
app.use(morgan('combined', { stream: accessLogStream }));

// Serve the static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Check if SSL is enabled in the config file
if (config.useSSL) {
    // SSL certificates (from config paths)
    const sslOptions = {
        key: fs.readFileSync(config.sslKeyPath), // Path to SSL private key
        cert: fs.readFileSync(config.sslCertPath), // Path to SSL certificate
    };

    // Create HTTPS server on specified SSL port
    https.createServer(sslOptions, app).listen(config.sslPort, () => {
        console.log(`HTTPS Server is running on port ${config.sslPort}`);
    });

} else {
    // Create HTTP server if SSL is not enabled
    const port = config.port || 8080;
    http.createServer(app).listen(port, () => {
        console.log(`HTTP Server is running on port ${port}`);
    });
}
