const { JobDAL } = require('./jobs.DAL');
const logger = require('../../utils/logger');

const StackOverflow = require('../../sources/stackoverflow');
const stackOverflow = new StackOverflow();


/* TODO:
 * ADD a notifications Service.
 *
 * Call that service when you add a JOB, pass job's data. and notify relevant users accordingly.
 *
*/
module.exports = class JobService {

  constructor(){};

  getJob = async ( jobNo ) => await JobDAL.getJob(jobNo);

  getJobs = async () => await JobDAL.getJobs();

  addJobToDB = async (data) => await JobDAL.addJob(data);

  addJobsToDB = async (jobs) => {

    const jobCount = jobs.length
    console.log(`adding ${jobCount} jobs....`)

    try {
      const jobs = await JobDAL.addJobs(jobs);
      logger.info(`Added ${jobCount} jobs to database.`);
      return jobs;
    } catch(e) {
      logger.debug("error adding bunch of jobs: ", e);
      return e;
    }
  };

  _notifyUsers = () => "SomeMethodOfNotifications_here";

  getStackOverflowJobs = async () => {
    logger.info(`FROM JOB_SERVICE :: Activating Stackoverflow Scraper`);
    const jobs = await stackOverflow.getJobs();
    logger.info(`  Received a batch of: ${jobs.length} jobs.  `);
    logger.info(`  Sending parsed data to the DATABASE  `);
    return await addJobsToDB(jobs)
  }

}
