const { JobModel } = require('./job.model');
const logger = require('../../utils/logger');

const addJob = async ({ title, href, company, stack, description, salary, joinDate, jobID }) => {

  try {
    return await new JobModel({
      title,
      href,
      company,
      stack,
      description,
      salary,
      joinDate,
      jobID
    }).save();
  }

  catch(err) { return err }

}

const addJobs = (jobs) => {
  console.log('inside jobsDAL')
  console.log('recevied jobs: ', jobs.length)
  return JobModel.insertMany(jobs);
}

const getJobs = async () => await JobModel.find({}).sort({joinDate: -1});

const deleteJob = async no => await JobModel.findOneAndRemove({jobID: no})

//testing only
const deleteAll = async () => await JobModel.remove({});

const getJob = async jobID => await JobModel.findOne({ jobID });

module.exports.JobDAL = {
  addJob,
  addJobs,
  deleteJob,
  deleteAll,
  getJob,
  getJobs
}
