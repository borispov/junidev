const express = require('express');
const { jobController } = require('./jobs.controllers');
const Router = express.Router();
const routeLogger = require('../../utils/routeLogger');

// retrieve a single job post
Router.get('/jobs/:id', jobController.getJob);

// retrieve all jobs
Router.get('/jobs', jobController.getJobs);

// post a new job
Router.post('/jobs/postjob', jobController.postJob);

// post new jobs
// Router.post('/jobs/postJobs', jobController.postJobs);

// Apply. -- should this be a route.. perhaps for.. tracking and analysis? 

Router.get('/private/getSO', jobController.getSO);

Router.get('/private/getIndeed', jobController.getIndeed);

Router.get('/private/getGlassdoor', jobController.getGlassdoor);

Router.get('/private/purge', jobController.purge);

module.exports = Router;
