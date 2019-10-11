const app = require('./src/app');
const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config();

const port = process.env.PORT || 3000;
const isDevMode = process.env.NODE_ENV === 'development' || false;
const isProdMode = process.env.NODE_ENV === 'production' || false;

// connect to local container's DB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const server = http.createServer(app);
server.listen(port);
