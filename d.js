// Import required modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/myapp');

// Define a schema for the PDF files
const pdfSchema = new mongoose.Schema({
  name: String,
  path: String
});

// Create a model for the PDF files
const Pdf = mongoose.model('Pdf', pdfSchema);

// Create an instance of Express.js
const app = express();

// Set the public directory for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/pdfs'));
  }
});

const upload = multer({ storage });

// Define a route for uploading PDF files
app.post('/upload', upload.single('pdf'), (req, res) => {
  // Get the uploaded PDF file
  const { file } = req;

  // Create a new PDF object
  const pdf = new Pdf({
    name: file.filename,
    path: `/pdfs/${file.filename}`
  });

  // Save the PDF object to MongoDB
  pdf.save((err, pdf) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    res.sendStatus(200);
  });
});

// Define a route for retrieving PDF files
app.get('/pdfs/:filename', (req, res) => {
  // Find the PDF file in MongoDB
  Pdf.findOne({ path: `/pdfs/${req.params.filename}` }, (err, pdf) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    if (!pdf) {
      return res.sendStatus(404);
    }

    // Serve the PDF file as a static file
    res.sendFile(path.join(__dirname, `public${pdf.path}`));
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
