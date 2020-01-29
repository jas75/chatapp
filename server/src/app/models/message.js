const mongoose = require('mongoose');
 
const MessageSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      trim: true,
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    dateCreation: {
      type: Date,
      date: { default: Date.now }
    }
});


module.exports = mongoose.model('Message', MessageSchema);
