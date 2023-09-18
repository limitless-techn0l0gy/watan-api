const mongoose = require("mongoose"),
  agentSchema = mongoose.Schema(
    {
      MC_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "membershipcodes",
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
      nameowner: {
        type: String,
        required: true,
      },
      nicknameowner: {
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
    },
    { timestamps: true }
  ),
  agentModel = mongoose.model("agents", agentSchema);
// agentModel.watch().on("change", (data) => console.log(new Date(), data));
module.exports = agentModel;
