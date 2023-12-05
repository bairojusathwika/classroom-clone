const express = require('express');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'CS204';
const collectionName = 'submissions';

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve the upload form
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Assignment Upload Page</title>
      </head>
      <body>
        <h1>Assignment Upload Page</h1>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <label for="name">Your Name:</label>
          <input type="text" id="name" name="name"><br><br>
          <label for="assignment">Select an assignment:</label>
          <select id="assignment" name="assignment">
            <option value="assignment1">Assignment 1</option>
            <option value="assignment2">Assignment 2</option>
            <option value="assignment3">Assignment 3</option>
          </select><br><br>
          <label for="file">Select a file:</label>
          <input type="file" id="file" name="file"><br><br>
          <input type="submit" value="Submit">
        </form>
      </body>
    </html>
  `);
});

// Handle the file upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Connect to the database
  MongoClient.connect(mongoUrl, (err, client) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to connect to the database');
    }
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Insert the file into the database
    collection.insertOne({
      name: req.body.name,
      assignment: req.body.assignment,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    }, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to upload file');
      }
      
      console.log(`File uploaded successfully: ${result.insertedId}`);
      res.send('File uploaded successfully');
      client.close();
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
