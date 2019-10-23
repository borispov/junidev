const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env')})

const app = require('./src/app');
const mongoose = require('mongoose');
const http = require('http');
const config = require('./config/');

const port = process.env.PORT || 3000;
const isDevMode = process.env.NODE_ENV === 'development' || false;
const isProdMode = process.env.NODE_ENV === 'production' || false;

mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MONGODB: Connected"))
  .catch(e => console.log("MONGODB: FAILED \n", e.msg));

const server = http.createServer(app);
server.listen(port);
