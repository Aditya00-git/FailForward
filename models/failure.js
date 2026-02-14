const mongoose = require("mongoose");

const failureSchema = new mongoose.Schema({
  title: String,
  category: String,
  reason: String,
  mood: String,
  date: String
});

module.exports = mongoose.model("Failure", failureSchema);
