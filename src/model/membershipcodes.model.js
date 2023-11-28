var d = new Date();
const mongoose = require("mongoose"),
  membershipcodesSchema = mongoose.Schema(
    {
      MC: {
        type: String,
        required: true,
        unique: true,
      },
      agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agents",
      },
      email: {
        type: String,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      expireIn: {
        type: {
          y: { type: Number, required: true, default: d.getFullYear() + 1 },
          m: { type: Number, required: true, default: d.getMonth() },
          d: { type: Number, required: true, default: d.getDate() },
        },
      },
    },
    { timestamps: true }
  ),
  membershipcodesModel = mongoose.model(
    "membershipcodes",
    membershipcodesSchema
  );
module.exports = membershipcodesModel;
