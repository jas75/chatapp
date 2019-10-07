const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
  user_id_1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true
  },
  user_id_2: {
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
