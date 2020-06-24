const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/foco-db");
mongoose.Promise = global.Promise;

module.exports = mongoose;
