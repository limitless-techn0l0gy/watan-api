const mongoose = require("mongoose"),
  buySchema = mongoose.Schema(
    {
      commerce_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "commerce",
        required: true,
      },
      billImage: {
        type: String,
      },
      points: {
        type: Number,
        required: true,
      },
      verify: {
        type: Boolean,
        required: true,
      },
      date: { type: Date, default: Date.now },
    },
    { timestamps: true }
  ),
  userSchema = mongoose.Schema(
    {
      userID: {
        type: String,
        lowercase: true,
        unique: true,
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
      currency: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      commerce: [buySchema],
    },
    { timestamps: true }
  ),
  userModel = mongoose.model("users", userSchema);
module.exports = userModel;
