//membershipcodes

const mongoose = require("mongoose"),
  membershipcodesSchema = mongoose.Schema(
    {
      MC: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        unique: true,
      },
    },
    { timestamps: true }
  ),
  membershipcodesModel = mongoose.model(
    "membershipcodes",
    membershipcodesSchema
  );
// membershipcodesModel.watch().on("change", (data) => console.log(new Date(), data));
module.exports = membershipcodesModel;
