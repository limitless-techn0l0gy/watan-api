const mongoose = require("mongoose"),
  staticSchema = mongoose.Schema({}, { timestamps: true }),
  staticModel = mongoose.model("static", staticSchema);
module.exports = staticModel;