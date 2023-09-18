const mongoose = require("mongoose"),
  serviceSchema = mongoose.Schema(
    {
      agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agents",
        required: true,
      },
      businessName: {
        type: String,
        required: true,
      },
      firstNumber: {
        type: String,
        required: true,
        unique: true,
      },
      secondNumber: {
        type: String,
        required: true,
        unique: true,
      },
      services: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      usersCount: {
        type: String,
        required: true,
      },
      availableUsers: [],
      license: {
        type: String,
        required: true,
      },
      discount: {
        type: String,
        required: true,
      },
      earn: {
        type: String,
        required: true,
      },
      images: [],
    },
    { timestamps: true }
  ),
  serviceModel = mongoose.model("services", serviceSchema);
serviceModel.watch().on("change", (data) => console.log(new Date(), data));
module.exports = serviceModel;
