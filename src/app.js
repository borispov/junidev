const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./utils/logger');
const mongoose = require('mongoose')
const path = require('path');
const exphbs = require('express-handlebars');

const {errorHandler} = require('./utils/errorHandler');
const jobRoutes = require('./components/jobs/jobs.routes');

const app = express();

process.on('uncaughtException', (error)  => {
  logger.error('Programmer Error, Kill system ',  error);
  console.error('Programmer Error, Kill system');
  process.exit(1);
})

process.on('unhandledRejection', (error, promise) => {
  console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
  console.log(' The error was: ', error );
  logger.info('Unhandled Promise', error);
});

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.set('views', path.join(__dirname, '..', 'views'));
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.enable('trust proxy');
app.disable('x-powered-by');

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', jobRoutes);

// endpoints for testing .. ??
app.get('/status', (req, res) => { res.status(200).end() });
app.head('/status', (req, res) => { res.status(200).end(); });

app.use(async (err, req, res, next) => {
  errorHandler(err, req, res);
  next();
});

app.get('/', (req,res) => {
  res.render('home', {
    content: "My Content"
  })
})

module.exports = app;
