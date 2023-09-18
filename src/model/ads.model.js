const mongoose = require("mongoose"),
  adsSchema = mongoose.Schema(
    {
      agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agents",
        required: true,
      },
      services_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services",
        required: true,
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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
      invoice: {
        type: String,
        required: true,
      },
      wataninvoice: {
        type: String,
        required: true,
      },
      userinvoice: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  ),
  adsModel = mongoose.model("ads", adsSchema);
adsModel.watch().on("change", (data) => console.log(new Date(), data));
module.exports = adsModel;
