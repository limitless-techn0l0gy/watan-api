const mongoose = require("mongoose"),
  saleShema = mongoose.Schema(
    {
      commerce_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "commerce",
        required: true,
      },
      earnings: {
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
      desc: {
        type: String,
      },
      numbers: [
        {
          number: { type: String, required: true, unique: true },
          contact: { type: String, required: true, default: "Call" },
          verify: { type: Boolean, required: true, default: false },
        },
      ],
      services: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      employees: {
        type: Number,
        default: 0,
        required: true, 
      },
      availableEmployees: [
        { type: mongoose.Schema.Types.ObjectId, ref: "employees" },
      ],
      customers: {
        type: Number,
        default: 0,
      },
      commerce: [saleShema],
      license: {
        type: String,
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
      currency: {
        type: String,
        required: true,
      },
      logo: {
        type: {
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
          date: { type: Date, default: Date.now },
        },
        required: false,
      },
      images: [
        {
          imageUrl: {
            type: String,
            required: true,
          },
          imageName: {
            type: String,
            required: true,
          },
          filePath: {
            type: String,
            required: true,
          },
          dirpath: {
            type: String,
            required: true,
          },
          date: { type: Date, default: Date.now },
        },
      ],
    },
    { timestamps: true }
  ),
  serviceModel = mongoose.model("services", serviceSchema);
module.exports = serviceModel;
