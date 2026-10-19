const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true
  },

  jobTitle: {
    type: String,
    required: true
  },

  company: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Applied"
  }
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;