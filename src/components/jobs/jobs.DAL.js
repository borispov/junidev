const { JobModel, TestM } = require('./job.model');
const uniqueValidator = require('mongoose-unique-validator');
const logger = require('../../utils/logger');


const addJob = async (job) => {

  try {
    const href = job['href'];
    const mbJob = JobModel.findOne({ href: job.href }, async (err, doc) => {
      if (err) return err
      if (doc === null) {
        setTimeout( async () => await new JobModel(job).save(), 100)
        return
      }
      console.log('JOB Already Exists');
      return null;
    })
  } catch(err) {
    console.log('error occured . . .\n', err);
    return err;
  }

}

const addJobs = async (jobs) => {

  console.log(`DAL :: Received ${jobs.length} Jobs:`)
  let jobsAdded = [];
  // if job does not exist, push to array that is returned as server response
  for (var i = 0; i < jobs.length; i++ ){
    const jobToAdd = await addJob(jobs[i]);
    jobToAdd !== null && jobsAdded.push(jobToAdd);
  }
  console.log('DAL :: ' + jobsAdded.length + ' jobs added.')
  return jobsAdded
}

const getJobs = async () => await JobModel.find({}).sort({joinDate: -1});

const deleteJob = async no => await JobModel.findOneAndRemove({jobID: no})

//testing only
const deleteAll = async () => await JobModel.remove({});

const getJobBySOID = SOID => JobModel.findOne({ SOID })

// const getJob = async query => await JobModel.findOne({ query });

const getJob = async query => {
  const tj = await JobModel.findOne( query );
  return tj
}

const getJobByLink = async href => await JobModel.findOne({ href: href });


module.exports.JobDAL = {
  addJob,
  addJobs,
  deleteJob,
  deleteAll,
  getJob,
  getJobs
}
