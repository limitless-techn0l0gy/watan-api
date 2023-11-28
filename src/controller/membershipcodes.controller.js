const MCModel = require("../model/membershipcodes.model"),
  agentModel = require("../model/agents.model"),
  serviceModel = require("../model/services.model"),
  jwt = require("jsonwebtoken"),
  validationResult = require("express-validator").validationResult,
  bcrypt = require("bcrypt"),
  { send, genCode } = require("../mail/mail"),
  render = async (req, res) => {},
  addMC = async (req, res) => {
    try {
      var { MC } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        var existMC = await MCModel.findOne({ MC });
        if (existMC == null) {
          var newMC = await MCModel.create({ MC });
          if (newMC != null) {
            var body = { type: "created" },
              token = jwt.sign(body, "8M3GXT4SuuUNNAOi", {
                expiresIn: "1h",
              });
            res.status(200).json({ type: true, token });
          } else {
            var body = { type: "not created" },
              token = jwt.sign(body, "8M3GXT4SuuUNNAOi", {
                expiresIn: "1h",
              });
            res.status(200).json({ type: true, token });
          }
        } else {
          var body = { type: "exist" },
            token = jwt.sign(body, "8M3GXT4SuuUNNAOi", {
              expiresIn: "1h",
            });
          res.status(200).json({ type: true, token });
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  };
module.exports = { render, addMC };
