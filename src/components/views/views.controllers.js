const logger = require('../../utils/logger');
const { AppError }= require('../../utils/errorHandler');

const JobService = require('../jobs/jobs.service');
const jobService = new JobService();

const renderHomePage = async (req, res, next) => {

  try {
    const jobs = await jobService.getJobs()
    return res.status(200).render('home', { jobs });
  } catch(err) {
    next(err);
    return res.status(200).render('404', { message: "No Jobs Available" })
  }

};


const renderJob = async (req, res, next) => {

  const { id } = req.params
  console.log(id)

  try {

    const requestedJob = await jobService.getJob(id);
    console.log(requestedJob);
    return res.render('job', { job: requestedJob });

  } catch(error) {

    const err = new AppError("mongoDB findOne", "AppError", error.msg, true);
    next(err);
    return res.status(404).render('404', { message: "error with retrieving the job.. tell us about it" });

  }

}

const applyJob = async (req, res, next) => {

  const { id } = req.params

  try {
    const requestedJob = await jobService.getJob(id);
    return res.redirect(requestedJob.href)
  } catch(error) {
    const err = new AppError(error.msg, "AppError", "Error In viewController.ApplyJob method", true);
    next(err);
    return res.status(404).render('404', { message: "error with retrieving the job.. tell us about it" });
  }

}

module.exports.viewsController = {
  renderHomePage, renderJob, applyJob
}
