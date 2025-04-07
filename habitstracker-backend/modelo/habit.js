const mongoose = require('mongoose');
const habitSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdate:{
    type: Date,
    default: Date.now
  },
  lastDone:{
    type: Date,
    default: Date.now
  },
  dias: {
    type: Number,
    default: 1
  }, 
  startedAt:{
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});
module.exports = mongoose.model('Habit', habitSchema);