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

Router.get('/private/getSO', jobController.scrapeAndSaveSO);

Router.get('/private/getIndeed', jobController.scrapeAndSaveIndeed)

Router.get('/private/purge', jobController.purge);

module.exports = Router;
