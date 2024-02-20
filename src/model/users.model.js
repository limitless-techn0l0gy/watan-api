const mongoose = require("mongoose"),
  billSchema = mongoose.Schema(
    {
      imageUrl: {
        type: String,
      },
      imageName: {
        type: String,
      },
      filePath: {
        type: String,
      },
      dirpath: {
        type: String,
      },
    },
    { timestamps: true }
  ),
  buySchema = mongoose.Schema(
    {
      serialNo: {
        type: String,
        unique: true,
        required: true,
      },
      commerce_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "commerce",
        required: true,
      },
      service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services",
        required: true,
      },
      billImage: {
        type: billSchema,
        required: false,
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
        number: { type: String, required: true, unique: true },
        contact: { type: String, required: true, default: "Call" },
        verify: { type: Boolean, required: true, default: false },
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
      fav: [
        { type: mongoose.Schema.Types.ObjectId, ref: "services" },
      ],
    },
    { timestamps: true }
  ),
  userModel = mongoose.model("users", userSchema);
module.exports = userModel;
