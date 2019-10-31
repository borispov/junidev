const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const CounterSchema = new Schema({
  _id: {type: String, required: true, unique: true},
  seq: { type: Number, default: 0 }
}, { _id: false })

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

JobSchema.plugin(uniqueValidator);

const TestSchema = new Schema({
  arr: [String]
});

const Counter = mongoose.model('counter', CounterSchema)

const JobModel = mongoose.model('Job', JobSchema);

const TestM = mongoose.model('test', TestSchema);

JobSchema.pre('save', true, function(next, done) {
  const doc = this;

  const mbj = JobModel.findOne({ href: doc.href }, (err, res) => {
    if (err || res) {
      const err = new Error(err || 'exists!')
      next(err);
    }
    next();
  })

  if (doc.isNew) {
    counter.findOneAndUpdate({ _id: 'jobs' }, {$inc: {seq: 1}}, function(err, counter) {
      if (err) return next(err)
      console.log(counter.seq);
      doc.jobID = counter.seq;
      next();
    })
  } else {
    next();
  }
})

module.exports = {
  JobModel,
  TestM
}

// module.exports.JobModel = mongoose.model('Job', JobSchema);
