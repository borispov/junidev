const path = require('path');
const bunyan = require('bunyan');

const logPath = logname => process.cwd() + `/logs/${logname}.log`;

const routeLogger = bunyan.createLogger({
    name: "express-routes-log",
    streams: [
        {
            level: 'info',
            path: logPath('activity'),
            stream: process.stdout
        },
        {
            type: 'rotating-file',
            level: 'error',
            path: logPath('RoutesLog'),
            period: '1d',
            count: 2
        }
    ]
});

module.exports = routeLogger;
