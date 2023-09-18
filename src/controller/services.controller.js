const serviceModel = require("../model/services.model"),
  jwt = require("jsonwebtoken"),
  validationResult = require("express-validator").validationResult,
  upload = async (req, res) => {
    try {
      var { id, images } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        var imageList = [],
          existService = await serviceModel.findById({ _id: id });
        images.forEach((image) => {
          imageList.push(image);
        });
        if (existService != null) {
          var upload = await serviceModel.findByIdAndUpdate(
            { _id: id },
            {
              images: imageList,
            },
            { new: true }
          );

          if (upload["images"].length <= 5) {
            var token = jwt.sign({ type: "update" }, "8M3GXT4SuuUNNAOi", {
              expiresIn: "1h",
            });
            console.log(token);
            res.status(200).json({ type: true, token });
          } else {
            res.json({ type: "error max data" });
          }
        } else {
          res.status(404).json({ type: "service not found" });
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  deleteImg = async (req, res) => {
    console.log("hello");
    res.json(req.body);
  },
  getServices = async (req, res) => {
    try {
      var { services } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        console.log(services);
        var get = await serviceModel.find({ services });
        res.status(200).json(get);
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  };
module.exports = { upload, deleteImg, getServices };
