const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  jobID: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  href: {
    type: String,
    required: true
  },

  //TODO: can add link. logo. info
  company: {
    type: String
  },

  stack: {
    type: [String],
    required: true
  },

  description: {
    type: String,
    required: true
  },

  salary: {
    type: String,
  },

  logo: {
    type: String
  },

  joinDate: {
    type: Date,
    Default: Date.now
  }

});

module.exports.JobModel = mongoose.model('Job', JobSchema);
