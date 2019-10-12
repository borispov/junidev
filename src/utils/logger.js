const path = require('path');
const bunyan = require('bunyan');

const logPath = logname => path.join(__dirname, '..', '..', 'logs', `${logname}.log`);

const logger = bunyan.createLogger({
    name: "express-bunyan-log",
    streams: [
        {
            level: 'info',
            path: logPath('activity'),
            stream: process.stdout
        },
        {
            type: 'rotating-file',
            level: 'error',
            // path: logPath('appError'),
            path: './logs/appError.log',
            period: '1d',
            count: 2
        }
    ]
});


module.exports = logger;
