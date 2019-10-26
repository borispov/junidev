const { JobModel } = require('./job.model');
const logger = require('../../utils/logger');

const addJob = async (job) => {

  try {
    const href = job['href'];
    const maybeJob = await getJobByLink(href);

    if (maybeJob !== null) {
      console.log('JOB Already Exists');
      return null;
    }

    const newJob = await new JobModel(job);
    newJob.save();
    return newJob;
  } catch(err) {
    console.log('error occured . . .\n', err);
    return err;
  }

}

const addJobs = async (jobs) => {
  console.log('Data Acess Layer. Received Number Of Jobs: ', jobs.length)
  let jobsAdded = [];
  for (var i = 0; i < jobs.length; i++ ){
    const jobToAdd = await addJob(jobs[i]);
    jobToAdd !== null && jobsAdded.push(jobToAdd);
  }
  // const jobsAdded = await jobs.map(async i => await addJob(i))
  return jobsAdded
}

const getJobs = async () => await JobModel.find({}).sort({joinDate: -1});

const deleteJob = async no => await JobModel.findOneAndRemove({jobID: no})

//testing only
const deleteAll = async () => await JobModel.remove({});

const getJobBySOID = SOID => JobModel.findOne({ SOID })

const getJob = async query => await JobModel.findOne({ query });

const getJobByLink = href => JobModel.findOne({ href });


module.exports.JobDAL = {
  addJob,
  addJobs,
  deleteJob,
  deleteAll,
  getJob,
  getJobs
}
