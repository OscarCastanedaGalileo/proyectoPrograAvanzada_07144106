const mongoose = require('mongoose');
const habitSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Habit', habitSchema);