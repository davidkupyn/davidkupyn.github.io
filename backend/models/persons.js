const mongoose = require('mongoose');

const personsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: false,
    },
    telephone: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { collection: 'persons' }
);

const Persons = mongoose.model('persons', personsSchema);

module.exports = Persons;
