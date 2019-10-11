const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

// For testing JOBDAL.js
// mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('connected'))
//   .catch(() => 'Failed')

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

  joinDate: {
    type: Date,
    Default: Date.now
  }

});

module.exports.JobModel = mongoose.model('Job', JobSchema);
