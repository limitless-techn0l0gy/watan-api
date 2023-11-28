const mongoose = require("mongoose"),
  employeeschema = mongoose.Schema(
    {
      agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agents",
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      nickname: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      governorate: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  ),
  employeesModel = mongoose.model("employees", employeeschema);
module.exports = employeesModel;
/*
  {
    "agent_id":"",
    "email":"",
    "password":"",
    "name":"",
    "nickname":"",
    "country":"",
    "governorate":"",
  }

*/
