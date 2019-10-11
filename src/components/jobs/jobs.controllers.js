const JobService = require('./jobs.service');
const Joi = require('joi');
const logger = require('../../utils/logger');
const { jobSchema } = require('./joi.schema');
const { AppError }= require('../../utils/errorHandler');

const jobService = new JobService();

const postJobs = async (req,res,next) => {
  // expects an array of jobs.
  const { jobs } = req.body;

  if (!jobs instanceof Array) {
    const error = new AppError(`Expects array as an argument, received: ${typeof jobs}`, "Invalid Input", _, true);
    next(error);
    return;
  }

  try {
    jobs.map(job => Joi.validate(job, jobSchema));
    await jobService.addJobs(jobs);
    return res.status(200).json({message: "Success", data: true})
  }
  catch(e) {
    next(e);
    return res.status(401).json({ message: e.msg })
  }
}

const postJob = async (req, res, next) => {

  const {
    title,
    href,
    company,
    stack,
    description,
    salary,
    joinDate,
    jobID
  } = req.body;


  const { value, err } = Joi.validate(req.body, jobSchema)

  if (err){
    const error = new AppError("Provided Wrong Data, Please correct and try again", "App Error", err.msg, true)
    next(error);
    return res.status(422).json({ message: e.msg, data: req.body })
  }

  try {
    const result = await jobService.addJobToDB(req.body);
    return res.status(200).json({ message: "Success", data: result });
  } catch(e) {
    logger.error(e);
    next(e);
    return res.status(400).json({ message: "The DB Serivce is Unavailable at the moment" })
  }

}

const getJobs = async (req, res, next) => {

  try {

    const jobs = await jobService.getJobs()
    if (!jobs.length) {
      return res.status(404).json({ message: "404, NO JOBS FOUND", body: null })
    }
    console.log(jobs.length + ' jobs has been found')
    return res.status(200).json({ message: "Success", body: jobs })
  } catch(err) {
    next(err);
    return res.status(404).json({ message: "DB is unavailable at the moment" })
  }

}

const getJob = async (req, res, next) => {

  const { id } = req.params

  const [requestedJob, err] = await jobService.getJob(id)

  if (err) {
    const error = new AppError("mongoDB findOne", "AppError", err.msg, true);
    next(error);
    return;
  }

  return requestedJob
}

const scrapeAndSaveSO = async (req, res, next) => {
  try {
    return await jobService.getStackOverflowJobs();
  } catch(e) {
    next(e);
  }
}



module.exports.jobController = {
  getJob, getJobs, postJob, scrapeAndSaveSO
}
