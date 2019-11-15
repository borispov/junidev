const { JobModel } = require('./job.model');
const logger = require('../../utils/logger');


const addJob = async (job) => {

  try {
    const mbjob = await JobModel.findOne({ href: job.href });
    if (mbjob === null) {
      const newjob = await new JobModel(job).save();
      return newjob
    }
    console.log('Potential Duplicate. Abort')
    return null

  } catch(err) {
    console.log('error occured . . .\n Possibly duplicate job..', err);
    // logger.debug("ERROR SAVING DOC TO DB", err)
    return err;
  }

}

const addJobs = async (jobs) => {

  console.log(`DAL :: Received ${jobs.length} Jobs:`)
  let jobsAdded = [];
  // if job does not exist, push to array that is returned as server response
  for (var i = 0; i < jobs.length; i++ ){
    const jobToAdd = await addJob(jobs[i]);
    jobToAdd !== null && jobToAdd instanceof Error === false && jobsAdded.push(jobToAdd);
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

const queryJobs = async query => {
  const q = query.split(' ')
  const parsedQ = q.length > 1
    ? q.split(' ').map(k => ['"'].concat(k, '"').join('')).join(' ')
    : query
  console.log('query: ', q);
  return await JobModel.find({ $text: { $search: parsedQ }}, { score: {$meta: "textScore"} }).sort({ joinDate: -1 });
}

module.exports.JobDAL = {
  addJob,
  addJobs,
  deleteJob,
  deleteAll,
  getJob,
  getJobs,
  queryJobs
}
