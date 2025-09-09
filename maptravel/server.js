const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve index.html for the root path
    let filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.url.startsWith('/images/')) {
    // Serve image files
    let imagePath = path.join(__dirname, req.url);
    // Decode URL-encoded characters in the path, especially spaces
    imagePath = decodeURIComponent(imagePath);
    console.log(`Attempting to serve image: ${imagePath}`); // Added log
    fs.readFile(imagePath, (err, content) => {
      if (err) {
        console.error(`Error reading image file ${imagePath}: ${err.message}`); // Added log
        res.writeHead(404);
        res.end('Image not found');
      } else {
        console.log(`Successfully read image file: ${imagePath}`); // Added log
        // Determine content type based on file extension
        const ext = path.extname(imagePath).toLowerCase();
        let contentType = 'application/octet-stream'; // Default
        switch (ext) {
          case '.png':
            contentType = 'image/png';
            break;
          case '.jpg':
          case '.jpeg':
            contentType = 'image/jpeg';
            break;
          case '.gif':
            contentType = 'image/gif';
            break;
          // Add more image types as needed
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  } else if (req.url.endsWith('.css')) {
    // Serve CSS files
    let cssPath = path.join(__dirname, req.url);
    fs.readFile(cssPath, (err, content) => {
      if (err) {
        console.error(`Error reading CSS file ${cssPath}: ${err.message}`);
        res.writeHead(404);
        res.end('CSS not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.url.endsWith('.mp3') || req.url.endsWith('.wav') || req.url.endsWith('.ogg') || req.url.endsWith('.m4a')) {
    // Serve audio files
    let audioPath = path.join(__dirname, req.url);
    fs.readFile(audioPath, (err, content) => {
      if (err) {
        console.error(`Error reading audio file ${audioPath}: ${err.message}`);
        res.writeHead(404);
        res.end('Audio not found');
      } else {
        const ext = path.extname(audioPath).toLowerCase();
        let contentType = 'application/octet-stream';
        switch (ext) {
          case '.mp3':
            contentType = 'audio/mpeg';
            break;
          case '.wav':
            contentType = 'audio/wav';
            break;
          case '.ogg':
            contentType = 'audio/ogg';
            break;
          case '.m4a':
            contentType = 'audio/mp4'; // Correct MIME type for M4A audio
            break;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  } else if (req.url.endsWith('.js')) {
    // Serve JavaScript files
    let jsPath = path.join(__dirname, req.url);
    fs.readFile(jsPath, (err, content) => {
      if (err) {
        console.error(`Error reading JavaScript file ${jsPath}: ${err.message}`);
        res.writeHead(404);
        res.end('JavaScript file not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(content, 'utf-8');
      }
    });
  } else {
    // Handle other requests (e.g., 404 Not Found)
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000');
});