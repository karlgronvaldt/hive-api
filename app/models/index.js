const mongoose = require("mongoose");

require("dotenv").config();
const dbConfig = process.env.connectionString;

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.uri = dbConfig;
db.user = require("./userModel.js");
db.post = require("./postModel.js");

module.exports = db;