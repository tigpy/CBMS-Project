// backend/models/Admin.js
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String // hashed
});

module.exports = mongoose.model('Admin', AdminSchema);
