const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true
  },
  areFriends: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Relationship', RelationshipSchema);
