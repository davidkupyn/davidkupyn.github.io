const mongoose = require('mongoose');

const studentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
  },
  { collection: 'students' }
);

const Students = mongoose.model('students', studentsSchema);

module.exports = Students;
