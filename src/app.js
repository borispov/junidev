const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./utils/logger');
const routeLogger = require('./utils/routeLogger');
const path = require('path');
const exphbs = require('express-handlebars');


const { errorHandler } = require('./utils/errorHandler');
const jobRoutes = require('./components/jobs/jobs.routes');
const viewRoutes = require('./components/views/views.routes');
const userRoutes = require('./components/users/users.routes');

const app = express();

process.on('uncaughtException', (error)  => {
  logger.error('Programmer Error, Kill system ',  error);
  process.exit(1);
})

process.on('unhandledRejection', (error, promise) => {
  console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
  logger.info('Unhandled Promise', error);
});

app.use(helmet());

app.use(express.static(path.join(__dirname, 'public' )));
app.set('views', path.join(__dirname, 'public', 'views'));
app.engine('.hbs', exphbs({ 
  defaultLayout: 'main', 
  extname: '.hbs',
  helpers: require('./public/js/handlebarUtils.js')
}));
app.set('view engine', '.hbs');


if (process.env.NODE_ENV === 'production') {
  app.enable('view cache');
}
app.enable('trust proxy');
app.disable('x-powered-by');

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', jobRoutes);
app.use('/', viewRoutes, userRoutes);

app.use(async (err, req, res, next) => {
  errorHandler(err, req, res);
  next();
});

app.use('*', (req,res,next) => {
  res.status(404).render('404', {link: "/", layout: '404.hbs'});
})

module.exports = app;
