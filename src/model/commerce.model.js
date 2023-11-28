const mongoose = require("mongoose"),
  commerceSchema = mongoose.Schema(
    {
      service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services",
        required: true,
      },
      employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees",
        required: true,
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      ta: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      earn: {
        type: Number,
        required: true,
      },
      taad: {
        type: Number,
        required: true,
      },
      earnings: {
        type: Number,
        required: true,
      },
      serialNo: {
        type: String,
        required: true,
      },
      date: { type: Date, default: Date.now },
    },
    { timestamps: true }
  ),
  commerceModel = mongoose.model("commerce", commerceSchema);
module.exports = commerceModel;
