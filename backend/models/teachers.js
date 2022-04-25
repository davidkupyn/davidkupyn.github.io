const mongoose = require('mongoose');

const teachersSchema = new mongoose.Schema(
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
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { collection: 'teachers' }
);

const Teachers = mongoose.model('teachers', teachersSchema);

module.exports = Teachers;
