const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');

// POST /assignments
// Create a new assignment and assign it to a group of students
router.post('/assignments', async (req, res) => {
  const { name, dueDate, studentIds } = req.body;

  try {
    // Create a new assignment
    const assignment = new Assignment({
      name,
      dueDate,
      students: [],
    });

    // Find the students who are assigned to this assignment
    const students = await Student.find({ _id: { $in: studentIds } });

    // Assign the assignment to the students
    students.forEach(student => {
      student.assignments.push(assignment);
      assignment.students.push(student);
    });

    // Save the changes to the database
    await assignment.save();
    await Promise.all(students.map(student => student.save()));

    res.status(201).json({ assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
