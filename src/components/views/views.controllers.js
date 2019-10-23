const logger = require('../../utils/logger');
const { AppError }= require('../../utils/errorHandler');
const JobService = require('../jobs/jobs.service');

// init jobservice
const jobService = new JobService();


// render all jobs to homepage
const renderHomePage = async (req, res, next) => {

  try {
    const jobs = await jobService.getJobs();
    return jobs.length
      ? res.status(200).render('home', { jobs })
      : res.status(404).render('404', { layout: '404.hbs', message: "No Jobs Available At The Moment.. Try again later" })
  } catch(error) {
    const err = new AppError(error.msg, 'AppError', 'view.controllers.renderHomePage failure', true);
    next(err);
    return;
  }
};

// : /job/:id
// Render a single job page, example: /job/345432
const renderJob = async (req, res, next) => {

  const { id } = req.params
  console.log(id)

  try {

    const requestedJob = await jobService.getJob(id);
    console.log(requestedJob);
    return requestedJob === null
      ? res.status(404).render('404', { message: "Cannot retrieve this job, if it it's not older than 30d, tell us about it, it's probably a bug", layout: '404.hbs'})
      : res.render('job', { job: requestedJob });

  } catch(error) {
    const err = new AppError("mongoDB findOne", "AppError", error.msg, true);
    next(err);
    return;

  }

}

// When user clicks 'Apply To Job', it'll redirect him to the source of the job posting
// It goes through this route. || Maybe logg this stuff || Maybe save for analytics.
const applyJob = async (req, res, next) => {

  const { id } = req.params

  try {
    const requestedJob = await jobService.getJob(id);
    return requestedJob === null
      ? res.status(404).render('404', { message: "Cannot retrieve this job, if it it's not older than 30d, tell us about it, it's probably a bug", layout: '404.hbs'})
      : res.redirect(requestedJob.href);
  } catch(error) {
    const err = new AppError(error.msg, "AppError", "Error In viewController.ApplyJob method", true);
    next(err);
    return;
  }

}

module.exports.viewsController = {
  renderHomePage, renderJob, applyJob
}
