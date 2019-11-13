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

  queryJobs = async ( query ) => {
    return await JobDAL.queryJobs(query)
  }

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

  getGlassdoorJobs = async loc => {
    logger.info(`FROM JOB_SERVICE:: Activating __Glassdoor__ robot`);
    const jobs = await glassdoor.getJobs(loc);
    console.log('my jobs: ', jobs.length);
    return await this.addJobsToDB(jobs);
  }

  getIndeedJobs = async () => {
    logger.info(`FROM JOB_SERVICE:: Activating __Indeed__ robot`);
    const jobs = await indeed.getJobs();
    console.log('my jobs: ', jobs.length);
    return await this.addJobsToDB(jobs);
  }

  getStackOverflowJobs = async loc => {
    logger.info(`FROM JOB_SERVICE :: Activating __Stackoverflow__ robot`);
    const jobs = await stackOverflow.getJobs(loc);
    logger.info(`  Sending ${jobs.length} parsed data to the DATABASE  `);
    return await this.addJobsToDB(jobs)
  };

  deleteAll = async () => await JobDAL.deleteAll();

}

module.exports = JobService;

// WHEN CALLED AS A SCRIPT
// NOT PART OF THE API FLOW

if (require.main === module) {

  (async () => {

    const services = [
      'getStackOverflowJobs',
      'getGlassdoorJobs',
      'getIndeedJobs'
    ]

    require('dotenv').config();
    const jobService = new JobService();
    const isFunction = fn => fn && {}.toString.call(fn) === '[object Function]';
    const sequence = (list = []) => { list.map(i => () =>new Promise (res =>isFunction(i) ? res(i()) : setTimeout(res, i))).reduce((p, n) => p.then(n), Promise.resolve())}

    const defaultScheme = async expanded => {
      let conn = [() => db(), 1800];
      let disc = [6000, () => dbOut()]
      return await sequence([conn, ...expanded, disc])
    }

    const runAll = async () => {
      console.log('Running on all');
      return await defaultScheme([
        () => jobService.getStackOverflowJobs(),
        35000,
        () => jobService.getIndeedJobs(),
        35000,
        () => jobService.getGlassdoorJobs(),
      ])
    }

    const singleCountry = c => async (service='') => {
      logger.info('Running a Single Service Job');
      console.log('Running on single');
      // if (service) return await defaultScheme([ () => jobService[service](c) ])
      if (service) {
        return await sequence([
          () => db(), 1800,
          () => jobService[service](c), 4800,
          () => dbOut()
        ])
      } 

      return await defaultScheme([
        () => jobService.getStackOverflowJobs(c),
        11500, () => jobService.getGlassdoorJobs(c)
      ])
    }

    const isService = x => services.includes(x)

    const args = process.argv.slice(2);
    const jobToRun = args.length && isService(args[0]) && args[0]
    const jobLoc = (!jobToRun && args.length && args ) ||
      args.length == 2 
      && args[1]
      || args.length > 2 
      && args.slice(1)
      || !jobToRun && args.length && args

    // We only need to connect when OUTSIDE the API scope.
    const db = () => 
      mongoose
        .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MONGODB: Connected From JobService."))
        .catch(e => {throw new Error(e)});

    const dbOut = () => mongoose.disconnect();

    try {

      if (jobToRun && !jobLoc) return await defaultScheme([() => jobService[jobToRun]()])

      return jobToRun && jobLoc
        ? await singleCountry(jobLoc)(jobToRun)
        : jobLoc
          ? await singleCountry(jobLoc)()
          : await runAll()

      // return jobToRun && jobLoc
      //   ? typeof jobLoc == 'string'
      //       ? await singleCountry(jobLoc)(jobToRun)
      //       : await multipleCountries(jobLoc)(jobToRun)
      //   : jobLoc
      //       ? await singleCountry(jobLoc)()
      //       : await runAll()

    } catch(e) {
      logger.log('Error', e)
      mongoose.disconnect();
    }

    })();
}
