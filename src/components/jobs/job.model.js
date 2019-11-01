const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const CounterSchema = new Schema({
  id: {type: String, required: true, unique: true},
  seq: { type: Number, default: 0 }
}, { id: false })

const counter = mongoose.model('counter', CounterSchema)

const JobSchema = new Schema({

  // used for routing. i.e: junidev.co/jobID/
  jobID: { type: String },

  // StackOverflow unique ID
  SOID: { type: String },

  // Glassdoor unique ID
  GDID: { type: String },

  title: {
    type: String,
    required: true
  },

  href: {
    type: String,
    required: true,
    unique: true
  },
  
  description: {
    type: String,
    required: true
  },

  // All optional.
  src: { type: String },
  about: { type: String },
  stack: { type: [String] },
  company: { type: String },
  location: { type: String },
  salary: { type: String },
  logo: { type: String },
  applyLink: { type: String },
  joinDate: { type: Date, Default: Date.now }

});

JobSchema.pre('save', async function(next) {
  const doc = this;
  if (doc.isNew) {
    counter.findOneAndUpdate({ id: 'jobs' }, {$inc: {seq: 1}}, function(err, counter) {
      if (err) return next(err)
      console.log('From model.presave:: \nJob Number: ' + counter.seq + ' Has Been Added.');
      doc.jobID = counter.seq;
      next();
    })
  }

})

JobSchema.plugin(uniqueValidator);

module.exports.JobModel = mongoose.model('Job', JobSchema);

