const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  color: { type: String, required: true, default: 'blue' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', categorySchema); 