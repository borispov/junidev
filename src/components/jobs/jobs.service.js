const mongoose = require('mongoose');
const { JobDAL } = require('./jobs.DAL');
const logger = require('../../utils/logger');


const StackOverflow = require('../scrapers/stackoverflow');
const stackOverflow = new StackOverflow();

const Indeed = require('../scrapers/indeed');
const indeed = new Indeed();

const Glassdoor = require('../scrapers/glassdoor');
const glassdoor = new Glassdoor();


/* TODO:
 * ADD a notifications Service.
 *
 * Call that service when you add a JOB, pass job's data. and notify relevant users accordingly.
 *
*/
class JobService {

  constructor(){};

  getJob = async ( jobNo ) => await JobDAL.getJob(jobNo);

  getJobs = async () => await JobDAL.getJobs();

  addJobToDB = async (data) => await JobDAL.addJob(data);

  addJobsToDB = async (jobs) => {

    const jobCount = jobs.length

    try {
      const jobsAdded = await JobDAL.addJobs(jobs);
      logger.info(`Added ${jobsAdded.length} jobs to database.`);
      return jobsAdded;
    } catch(e) {
      logger.debug("error adding bunch of jobs: ", e);
      return e;
    }
  };

  _notifyUsers = () => "SomeMethodOfNotifications_here";

  getGlassdoorJobs = async () => {
    logger.info(`FROM JOB_SERVICE:: Activating __Glassdoor__ robot`);
    const jobs = await glassdoor.getJobs();

    console.log('my jobs: ', jobs.length);
    return await this.addJobsToDB(jobs);
  }

  getIndeedJobs = async () => {
    logger.info(`FROM JOB_SERVICE:: Activating __Indeed__ robot`);
    const jobs = await indeed.getJobs();

    console.log('my jobs: ', jobs.length);
    return await this.addJobsToDB(jobs);
  }

  getStackOverflowJobs = async () => {
    logger.info(`FROM JOB_SERVICE :: Activating __Stackoverflow__ robot`);

    console.log('hello from stackoverflow worker');
    const jobs = await stackOverflow.getJobs();
    logger.info(`  Sending ${jobs.length} parsed data to the DATABASE  `);
    return await this.addJobsToDB(jobs)
  };

  deleteAll = async () => await JobDAL.deleteAll();

}

module.exports = JobService;

if (require.main === module) {

  (async () => {
    const jobService = new JobService();
    const sequence = (list = []) => {list.map(i => () => new Promise(res => isFunction(i) ? res(i()) : setTimeout(res, i))).reduce((p, n) => p.then(n), Promise.resolve())}
    const isFunction = fn => fn && {}.toString.call(fn) === '[object Function]';

    require('dotenv').config();
    const workerState = {
      stackoverflow: { finished: false, running: false},
      indeed: { finished: false, running: false},
      glassdoor: { finished: false, running: false}
    };

    const db = () => 
      mongoose
        .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MONGODB: Connected From JobService."))
        .catch(e => console.log("MONGODB: FAILED \n", e.msg));


    try {

      return await sequence([
        () => db(),
        2250,
        () => jobService.getStackOverflowJobs(),
        18000,
        () => jobService.getIndeedJobs(),
        18000,
        () => jobService.getGlassdoorJobs(),
        18000,
        () => mongoose.disconnect()
      ])

    } catch(e) {
      logger.log('Error', e)
      mongoose.disconnect();
    }

    })();
}
