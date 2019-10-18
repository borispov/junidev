const StackOverflow = require('./stackoverflow');
const JobService = require('../components/jobs/jobs.service');

const jobService = new JobService();

const stackOverflow = new StackOverflow();

// module.exports = {
//   SO: StackOverflow
// }


(async () => {

  // const argu = process.argv[2];
  // if (!argu) throw new Error('No Arguments supplied. Exiting ...');

  try {
    const jobs = await stackOverflow.getJobs();
    const jobsInsertion = await jobService.addJobsToDB(jobs);

    console.log(
      jobsInsertion
    )
  } catch(e) {
    console.log('Caught An Error .............. ');
    console.error(e);
  }


})();
