const mongoose = require("mongoose"),
  agentSchema = mongoose.Schema(
    {
      MC: {
        type: String,
        required: true,
        unique: true,
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
    },
    { timestamps: true }
  ),
  agentModel = mongoose.model("agents", agentSchema);
module.exports = agentModel;
