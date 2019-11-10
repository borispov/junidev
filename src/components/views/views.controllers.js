const logger = require('../../utils/logger');
const { AppError }= require('../../utils/errorHandler');
const JobService = require('../jobs/jobs.service');

//TODO: Check if I need to optimize the code here.

// init jobservice
const jobService = new JobService();

// render all jobs to homepage
const renderHomePage = async (req, res, next) => {

  res.locals.metaTags = {
    title: `Junior Developer/Design Jobs in Web Development, Software, Data Science and more`,
    description: "Junior Jobs For Aspiring Tech Talents",
    keywords: "Junior Developer Designer Job Roles Entry Level Graduate Internship Tech Remote Software Engineering"
  }

  try {
    const jobs = await jobService.getJobs();

    return res.status(200).render('home', { jobs })
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

  try {

    const requestedJob = await jobService.getJob({ jobID: id });
    console.log(requestedJob);

    res.locals.metaTags = {
      title: requestedJob === null ? 'Junior Job Not Found' : `jDev - ${requestedJob.title}`,
      description: `Job at ${requestedJob.company} | ${requestedJob.location}`,
      keywords: `Junior ${requestedJob.stack && requestedJob.stack.join(" ")} Developer Designer Job Roles Entry Level Graduate Internship Tech Remote Software Engineering`
    }

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
    const requestedJob = await jobService.getJob({ jobID: id });
    return requestedJob === null
      ? res.status(404).render('404', { message: "Cannot retrieve this job, if it it's not older than 30d, tell us about it, it's probably a bug", layout: '404.hbs'})
      : res.redirect(requestedJob.href);
  } catch(error) {
    const err = new AppError(error.msg, "AppError", "Error In viewController.ApplyJob method", true);
    next(err);
    return;
  }

}

const searchJobs = async (req, res, next) => {
  const query = req.query.q || null;
  console.log(query)
  if (query === null) {
    return;
  }

  const getJobs = await jobService.queryJobs(query)
  if (!getJobs || !getJobs.length || ( getJobs[0] && !getJobs[0].title )) {
    return res.status(200).json({ searchMessage: "Nothing For Those Keywords" })
    // return res.status(404).render('home', { searchMessage: "Nothing For Those Keywords" })
  }

  res.locals.metaTags = {
    title: "Junidev - Dev and Design",
    description: "Junidev | Customized Job Search",
    keywords: "Junior Developer Designer Job Roles Entry Level Graduate Internship"
  }

  return res.status(200).render("home", { jobs: getJobs })
}



module.exports.viewsController = {
  renderHomePage, renderJob, applyJob, searchJobs
}
