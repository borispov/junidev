const path = require('path');
const bunyan = require('bunyan');

const logPath = logname => process.cwd() + `/logs/${logname}.log`;

const botLogger = bunyan.createLogger({
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
            path: logPath('ScrapeLog'),
            period: '1d',
            count: 2
        }
    ]
});

module.exports = botLogger;
