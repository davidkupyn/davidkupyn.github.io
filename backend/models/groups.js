const mongoose = require('mongoose');

const groupsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userid: {
      type: Array,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { collection: 'groups' }
);

const Groups = mongoose.model('groups', groupsSchema);

module.exports = Groups;
