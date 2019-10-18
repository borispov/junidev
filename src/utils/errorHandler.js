const logger = require('./logger');

function errorHandler(err, req, res) {
  logError(err);

  if (!err.isOperational) {
    throw new Error("Non Operational Error Occured.. Exiting.");
  }

  let message = err ? err.message : "Internal Server Error";

  res.json({
    error: { message: message }
  });

  function logError(error) {
    logger.error(err);
    console.log({
      message: error.message,
      stack: error.stack
    });
  }
  
}


function AppError(message, name, description, isOperational){ 
  this.message = message;
  // Error.call(this);
  Error.captureStackTrace(this);
  this.name = name || "Server Error";
  this.description = description;
  this.isOperational = isOperational;
}

AppError.prototype = Object.create(Error.prototype);

function ScrapeError(message, name, description, isOperational) {
  this.message = message;
  Error.captureStackTrace(this);
  this.name = name || "Scraper Error";
  this.description = description;
  this.isOperational = isOperational;
}

ScrapeError.prototype = Object.create(Error.prototype);

module.exports = {
  AppError,
  errorHandler,
  ScrapeError
}
