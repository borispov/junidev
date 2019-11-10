const express = require('express');
const Router = express.Router();

const { viewsController } = require('./views.controllers');

Router.get('/', viewsController.renderHomePage);

Router.get('/job/:id', viewsController.renderJob);

Router.get('/job/:id/apply', viewsController.applyJob);

Router.get('/jobs/search', viewsController.searchJobs);

module.exports = Router;
