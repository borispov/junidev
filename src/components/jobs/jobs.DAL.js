const { JobModel } = require('./job.model');
const logger = require('../../utils/logger');

const addJob = async (job) => {

  try {
    if (job.src === 'stackoverflow') {
      const maybeJob = await getJobBySOID(job.SOID);
      if (maybeJob) throw new Error('Job Already Exists')
    }

    const newJob = await new JobModel(job);
    newJob.save((err, j) => {
      if (err) return err
      console.log(`JOB has been saved to DB: \n${j}`)
    });
    return newJob;
  } catch(err) {
    console.log('error occured . . .\n', err);
    return err;
  }

}

const addJobs = (jobs) => {
  console.log('inside jobsDAL')
  console.log('recevied jobs: ', jobs.length)
  // return JobModel.insertMany(jobs);
  return jobs.map(addJob);
}

const getJobs = async () => await JobModel.find({}).sort({joinDate: -1});

const deleteJob = async no => await JobModel.findOneAndRemove({jobID: no})

//testing only
const deleteAll = async () => await JobModel.remove({});

const getJobBySOID = SOID => JobModel.findOne({ SOID })

const getJob = async jobID => await JobModel.findOne({ jobID });

module.exports.JobDAL = {
  addJob,
  addJobs,
  deleteJob,
  deleteAll,
  getJob,
  getJobs
}
