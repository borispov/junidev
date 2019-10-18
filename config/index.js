require('dotenv').config();

module.exports = config = {
  databaseURL: process.env.DB_URL
}

console.log(process.env.DB_URI)
