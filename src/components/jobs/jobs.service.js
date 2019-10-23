const { JobDAL } = require('./jobs.DAL');
const logger = require('../../utils/logger');

const StackOverflow = require('../scrapers/stackoverflow');
const stackOverflow = new StackOverflow();

const Indeed = require('../scrapers/indeed');
const indeed = new Indeed();


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
      const jobsAdded = await JobDAL.addJobs(jobs);
      logger.info(`Added ${jobCount} jobs to database.`);
      return jobsAdded;
    } catch(e) {
      logger.debug("error adding bunch of jobs: ", e);
      return e;
    }
  };

  _notifyUsers = () => "SomeMethodOfNotifications_here";

  getIndeedJobs = async () => {
    logger.info(`FROM JOB_SERVICE:: Activating __Indeed__ Scraper`);
    const jobs = await indeed.getJobs();

    console.log('my jobs: ', jobs.length);
    return await this.addJobsToDB(jobs);
  }

  getStackOverflowJobs = async () => {
    logger.info(`FROM JOB_SERVICE :: Activating __Stackoverflow__ Scraper`);
    const jobs = await stackOverflow.getJobs();

    console.log('my jobsssssssssss : ', jobs)
    // logger.info(`  Received a batch of: ${jobs.length} jobs.  `);
    // logger.info(`  Sending parsed data to the DATABASE  `);
    return await this.addJobsToDB(jobs)
  };

  deleteAll = async () => await JobDAL.deleteAll();

}
