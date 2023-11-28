const agentModel = require("../model/agents.model"),
  MCModel = require("../model/membershipcodes.model"),
  serviceModel = require("../model/services.model"),
  jwt = require("jsonwebtoken"),
  validationResult = require("express-validator").validationResult,
  bcrypt = require("bcrypt"),
  { send, genCode } = require("../mail/mail"),
  getAgentInfo = async (req, res) => {
    try {
      var { id } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        var existAgent = await agentModel.findById({ _id: id });
        if (existAgent == null) {
          res.status(404).json({ type: "your account isn't exist" });
        } else {
          var agentService = await serviceModel.findOne({
            agent_id: existAgent["_id"],
          });
          var body = {
              _id: existAgent["_id"],
              service: agentService,
              email: existAgent["email"],
              password: existAgent["password"],
              nameowner: existAgent["nameowner"],
              nicknameowner: existAgent["nicknameowner"],
              country: existAgent["country"],
              governorate: existAgent["governorate"],
              currency: existAgent["currency"],
              createdAt: existAgent["createdAt"],
              updatedAt: existAgent["updatedAt"],
              __v: existAgent["__v"],
            },
            token = jwt.sign(body, "8M3GXT4SuuUNNAOi", {
              expiresIn: "1h",
            });
          res.status(200).json({ type: true, token: token });
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  CheckMembershipCode = async (req, res) => {
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
        if (existMC != null) {
          var body = {
              _id: existMC["_id"],
              MC: existMC["MC"],
              createdAt: existMC["createdAt"],
              updatedAt: existMC["updatedAt"],
              __v: existMC["__v"],
            },
            token = jwt.sign(body, "8M3GXT4SuuUNNAOi", {
              expiresIn: "1h",
            });
          res.status(200).json({ type: true, token: token });
        } else {
          var body = {
              type: "not exist",
            },
            token = jwt.sign(body, "8M3GXT4SuuUNNAOi", {
              expiresIn: "1h",
            });
          res.status(200).json({ type: true, token: body });
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  register = async (req, res) => {
    try {
      var { email } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        existAgent = await agentModel.findOne({ email });
        if (existAgent != null) {
          res.json({ type: "your account is exist" });
        } else {
          var code = genCode(),
            subject = "Create an account",
            htmlTemplate = `Hello,<br />
              - This is your verification code: 
              <p style="font-weight:800; color: red;">${code}</p>`,
            send = await send(email, subject, htmlTemplate),
            msgStatus = send.response.includes("OK"),
            resBody = {
              email: email,
              code: code,
              msgStatus: msgStatus,
            },
            token = jwt.sign(resBody, "8M3GXT4SuuUNNAOi", { expiresIn: "1h" });
          res.status(200).json({ type: true, token: token });
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  verify = async (req, res) => {
    try {
      var {
          MC_id,
          email,
          password,
          businessName,
          nameowner,
          nicknameowner,
          usersCount,
          license,
          discount,
          earn,
          country,
          governorate,
          services,
          currency,
          location,
          firstNumber,
          secondNumber,
        } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        var existAgent = await agentModel.findOne({ email }),
          checkPhoneNumberOne = await agentModel.findOne({ email }),
          checkPhoneNumberTow = await agentModel.findOne({ email });
        if (existAgent != null) {
          res.json({ type: "your account is exist" });
        } else if (checkPhoneNumberOne != null) {
          res.json({ type: "your first number is exist" });
        } else if (checkPhoneNumberTow != null) {
          res.json({ type: "your second number is exist" });
        } else {
          var salt = await bcrypt.genSalt(10),
            hashpass = await bcrypt.hash(password, salt),
            password = hashpass,
            newAgent = await agentModel.create({
              MC_id,
              email,
              password,
              nameowner,
              nicknameowner,
              country,
              governorate,
              currency,
            });
          if (newAgent) {
            var data = { id: newAgent["id"] },
              newService = await serviceModel.create({
                agent_id: data.id,
                businessName,
                firstNumber,
                secondNumber,
                services,
                usersCount,
                license,
                location,
                discount,
                earn,
              });
            if (newService) {
              data = {
                id: newAgent["id"],
                service: newService["id"],
              };
              var token = jwt.sign(data, "8M3GXT4SuuUNNAOi", {
                expiresIn: "1h",
              });
              res.status(200).json({ type: true, token: token });
            }
          } else {
            res.json({ type: "An error occurred when creating an account" });
          }
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  Login = async (req, res) => {
    try {
      var { email, password } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json(errorValidate);
      } else {
        var agentCheck = await agentModel.findOne({ email: email }),
          serviceData = await serviceModel.findOne({
            agent_id: agentCheck["id"],
          });
        if (agentCheck != null && serviceData != null) {
          const isMatch = await bcrypt.compare(
            password,
            agentCheck["password"]
          );
          if (isMatch) {
            var data = {
                id: agentCheck["id"],
                service: serviceData["id"],
              },
              token = jwt.sign(data, "8M3GXT4SuuUNNAOi", {
                expiresIn: "1h",
              });
            res.status(200).json({ type: true, token: token });
          } else {
            res.json({ type: "password not correct" });
          }
        } else {
          res.json({ type: "agent not exist" });
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  updatepass = async (req, res) => {
    try {
      var { email, password, vpassword } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        var checkoldpassword = await agentModel.findOne({ email: email });
        if (checkoldpassword != null) {
          const isMatch = await bcrypt.compare(
            password,
            checkoldpassword["password"]
          );
          if (!isMatch) {
            var salt = await bcrypt.genSalt(10),
              hashpass = await bcrypt.hash(password, salt);
            if (password == vpassword) {
              password = hashpass;
              var updateAgent = await agentModel.findByIdAndUpdate(
                { _id: checkoldpassword["id"] },
                {
                  password,
                },
                { new: true }
              );
              if (updateAgent != null) {
                var data = {
                    desc: "updated",
                  },
                  token = jwt.sign(data, "8M3GXT4SuuUNNAOi", {
                    expiresIn: "1h",
                  });
                res.status(200).json({ type: true, token: token });
              }
            } else {
              res.json({ type: "passwords not equal" });
            }
          } else {
            res.json({ type: "please enter a new password" });
          }
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  forgot = async (req, res) => {
    try {
      var { email } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        existAgent = await agentModel.findOne({ email: email });
        if (existAgent == null) {
          res.json({ type: "your account is not exist" });
        } else {
          var code = genCode(),
            subject = "Password reset request",
            htmlTemplate = `Hello,<br />
            - This is your verification code: 
            <p style="font-weight:800; color: red;">${code}</p>`,
            send = await send(email, subject, htmlTemplate),
            msgStatus = send.response.includes("OK"),
            resBody = {
              email: email,
              code: code,
              msgStatus: msgStatus,
            },
            token = jwt.sign(resBody, "8M3GXT4SuuUNNAOi", { expiresIn: "1h" });
          res.status(200).json({ type: true, token: token });
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  employeeCheck = async (req, res) => {
    try {
      var { email } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        var existAgent = await agentModel.findOne({ email: email });
        if (existAgent != null) {
          var agent_id = existAgent["id"],
            serviceData = await serviceModel.findOne({ agent_id: agent_id }),
            uc = parseInt(serviceData["usersCount"]),
            au = serviceData["availableUsers"];
          if (uc > au.length) {
            var data = {
                type: true,
              },
              token = jwt.sign(data, "8M3GXT4SuuUNNAOi", {
                expiresIn: "1h",
              });
            res.status(200).json({ type: true, token: token });
          } else {
            res.json({ type: "max" });
          }
        } else {
          res.json({ type: "not exist" });
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  deleteaccount = async (req, res) => {
    const { id } = req.body;
    errorValidate = validationResult(req).array();
    if (errorValidate.length > 0) {
      res.json(errorValidate);
    } else {
      const deletedAgent = await agentModel.findByIdAndRemove(
        { _id: id },
        { new: true }
      );
      if (deletedAgent) {
        res.json(deletedAgent);
      } else {
        req.json({ type: "account not exist" });
      }
    }
  };
module.exports = {
  getAgentInfo,
  CheckMembershipCode,
  register,
  verify,
  Login,
  updatepass,
  forgot,
  employeeCheck,
  deleteaccount,
};
/*
try {
} catch (error) {
  res.json({ type: "catch error", desc: error});
}
*/
