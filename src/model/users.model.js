const mongoose = require("mongoose"),
  userSchema = mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      gender: {
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
      points: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  ),
  userModel = mongoose.model("users", userSchema);
userModel.watch().on("change", (data) => console.log(new Date(), data));
module.exports = userModel;

