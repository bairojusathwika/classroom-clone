const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/CS204', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const assignmentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }],
  });

  const studentSchema = new mongoose.Schema({
    Id: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    assignments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    }],
  });
  
  const Assignment = mongoose.model('Assignment', assignmentSchema);
  const Student = mongoose.model('Student', studentSchema);

  const newAssignment = new Assignment({
    name: 'Math Assignment',
    dueDate: new Date('2023-05-01'),
    students: [],
  });
  
  //await newAssignment.save();


  newAssignment.save().then(() => {
    console.log('Save operation complete');
  }).catch((error) => {
    console.error(error);
  });
  