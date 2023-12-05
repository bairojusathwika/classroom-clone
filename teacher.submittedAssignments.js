// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/CS204', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Define a schema for student submissions
const submissionSchema = new mongoose.Schema({
  studentName: String,
  assignmentId: String,
  files: [{
    name: String,
    path: String,
  }],
});

// Define a model for student submissions using the schema
const Submission = mongoose.model('Submission', submissionSchema);

// Create an Express app
const app = express();

// Define a route to get the list of submitted assignments
app.get('/assignments', async (req, res) => {
  try {
    // Find all submissions in the database
    const submissions = await Submission.find();
    
    // Create an array of student names who have submitted their assignments
    const studentNames = submissions.map(submission => submission.studentName);
    
    // Return the array of student names as JSON
    res.json(studentNames);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
