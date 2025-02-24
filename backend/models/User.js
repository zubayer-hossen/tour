const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // Unique email
  phone: { type: String, required: true, unique: true },  // Unique phone number
  tshirtSize: { type: String, required: true },
  feeStatus: { type: String, default: "Pending..." }, // ✅ Default value set, no longer required
});

module.exports = mongoose.model('User', userSchema);

