const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Define submission schema
const submissionSchema = new mongoose.Schema({
  studentName: String,
  assignmentId: String,
  files: [{
    name: String,
    path: String,
  }],
});

// Define submission model
const Submission = mongoose.model('Submission', submissionSchema);

// Set up Mongoose connection
mongoose.connect('mongodb://127.0.0.1/submissions', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Set up middleware
app.use(express.static('public'));

// Set up routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + 'index.html');
});

app.get('/submissions/:id', (req, res) => {
  const id = req.params.id;
  Submission.findById(id, (err, submission) => {
    if (err) throw err;
    if (!submission) {
      res.status(404).send(`Submission with id ${id} not found`);
      return;
    }
    const fileNames = submission.files.map((file) => file.name);
    res.render('submission', { submission, files: fileNames });
  });
});

app.get('/submissions/:id/files/:filename', (req, res) => {
  const id = req.params.id;
  const filename = req.params.filename;
  Submission.findById(id, (err, submission) => {
    if (err) throw err;
    if (!submission) {
      res.status(404).send(`Submission with id ${id} not found`);
      return;
    }
    const file = submission.files.find((file) => file.name === filename);
    if (!file) {
      res.status(404).send(`File ${filename} not found for submission with id ${id}`);
      return;
    }
    const filePath = path.join(__dirname, 'uploads', id, filename);
    res.download(filePath, file.name);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
