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

    console.log(maybeJob)

    const newJob = await new JobModel(job).save();
    // newJob.save();
    return newJob;
  } catch(err) {
    console.log('error occured . . .\n', err);
    return err;
  }

}

const addJobs = async (jobs) => {

  // PromiseAll -- parallel saving.
  // const allModels = jobs.map(eachJob => new JobModel(eachJob));
  // const uniqueModels = noDups(allModels, 'href');
  // const jjs = await Promise.all(uniqueModels.map(x => x.save()));
  // return jjs

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

const getJobByLink = async href => await JobModel.findOne({ href });


module.exports.JobDAL = {
  addJob,
  addJobs,
  deleteJob,
  deleteAll,
  getJob,
  getJobs
}
