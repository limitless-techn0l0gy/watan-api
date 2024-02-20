const mongoose = require("mongoose"),
  staticSchema = mongoose.Schema({
    dollar: {
      type: Number,
    },
    ads: [String],
  }, { timestamps: true }),
  agentsSchema = mongoose.Schema({
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agents",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  }, { timestamps: true }),
  usersSchema = mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  }, { timestamps: true }),
  adminSchema = mongoose.Schema({
    user: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    data: {
      type: staticSchema,
      required: false,
    },
    agents: {
      type: agentsSchema,
      required: false,
    },
    users: {
      type: usersSchema,
      required: false,
    },
  }, { timestamps: true }),
  adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;