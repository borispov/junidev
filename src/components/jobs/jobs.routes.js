const express = require('express');
const { jobController } = require('./jobs.controllers');
const Router = express.Router();

// retrieve a single job post
Router.get('/jobs/:id', jobController.getJob);

// retrieve all jobs
Router.get('/jobs', jobController.getJobs);

// post a new job
Router.post('/jobs/postjob', jobController.postJob);

// post new jobs
// Router.post('/jobs/postJobs', jobController.postJobs);

// Apply. -- should this be a route.. perhaps for.. tracking and analysis? 

Router.post('/jobs/postJobs', jobController.scrapeAndSaveSO);

module.exports = Router;
