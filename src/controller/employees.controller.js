const employeesModel = require("../model/employees.model"),
  agentModel = require("../model/agents.model"),
  serviceModel = require("../model/services.model"),
  jwt = require("jsonwebtoken"),
  validationResult = require("express-validator").validationResult,
  bcrypt = require("bcrypt"),
  { send, genCode } = require("../mail/mail"),
  getEmployeeInfo = async (req, res) => {
    try {
      var { id } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        var existEmployee = await employeesModel
          .findById({ _id: id })
          .populate("agent_id");
        if (existEmployee == null) {
          res.status(404).json({ type: "your account isn't exist" });
        } else {
          var body = {
              _id: existEmployee["id"],
              agent_id: existEmployee["agent_id"],
              email: existEmployee["email"],
              password:existEmployee["password"],
              name:existEmployee["name"],
              nickname: existEmployee["nickname"],
              country: existEmployee["country"],
              governorate: existEmployee["governorate"],
              createdAt: existEmployee["createdAt"],
              updatedAt: existEmployee["updatedAt"],
              __v: existEmployee["__v"],
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
      var {
          email,
          agentEmail,
          password,
          name,
          nickname,
          country,
          governorate,
        } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        var agentData = await agentModel.findOne({ email: agentEmail });
        if (agentData != null && agentData["email"] != email) {
          var serviceData = await serviceModel.findOne({
              agent_id: agentData["id"],
            }),
            salt = await bcrypt.genSalt(10),
            hashpass = await bcrypt.hash(password, salt),
            password = hashpass,
            activeUsersList = [],
            employeeData = {
              agent_id: agentData["id"],
              email,
              password,
              name,
              nickname,
              country,
              governorate,
            };
          if (serviceData["availableUsers"].length < 5) {
            var existEmployee = await employeesModel.findOne({ email });
            if (existEmployee == null) {
              var newEmployee = await employeesModel.create(employeeData);
              if (newEmployee != null) {
                serviceData["availableUsers"].forEach((user) => {
                  activeUsersList.push(user);
                });
                activeUsersList.push(newEmployee["id"]);
                var updateServices = await serviceModel.findByIdAndUpdate(
                  { _id: serviceData["id"] },
                  {
                    availableUsers: activeUsersList,
                  },
                  { new: true }
                );
                if (updateServices != null) {
                  var data = {
                      id: agentData["id"],
                      employee: newEmployee["id"],
                      service: updateServices["id"],
                    },
                    token = jwt.sign(data, "8M3GXT4SuuUNNAOi", {
                      expiresIn: "1h",
                    });
                  res.status(200).json({ type: true, token: token });
                }
              }
            } else {
              res.json({ type: "exist" });
            }
          } else {
            res.json({ type: "max" });
          }
        } else {
          res.json({ type: "Email error" });
        }
      }
    } catch (error) {
      res.json({ type: "catch error", desc: error });
    }
  },
  login = async (req, res) => {
    try {
      var { email, password } = req.body,
        errorValidate = validationResult(req).array();
      if (errorValidate.length > 0) {
        res.json({
          type: "Wrong entry",
          error: errorValidate,
        });
      } else {
        var employeeCheck = await employeesModel
            .findOne({ email: email })
            .populate("agent_id"),
          agentCheck = employeeCheck["agent_id"],
          serviceData = await serviceModel.findOne({
            agent_id: agentCheck["id"],
          }),
          id = agentCheck["id"],
          service = serviceData["id"],
          employee = employeeCheck["id"];

        if (employeeCheck != null) {
          const isMatch = await bcrypt.compare(
            password,
            employeeCheck["password"]
          );
          if (isMatch) {
            var data = {
                id,
                employee,
                service,
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
        existEmployee = await employeesModel.findOne({ email: email });
        if (existEmployee == null) {
          res.json({ type: "your account is not exist" });
        } else {
          var code = genCode(),
            subject = "Password reset request",
            htmlTemplate = `Hello,<br />
            - This is your verification code: 
            <p style="font-weight:800; color: red;">${code}</p>`,
            send = await send(email, subject, htmlTemplate),
            msgStatus = send.response.includes("OK"),
            data = {
              email: email,
              code: code,
              msgStatus: msgStatus,
            },
            token = jwt.sign(data, "8M3GXT4SuuUNNAOi", { expiresIn: "1h" });
          res.status(200).json({ type: true, token: token });
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
        var checkoldpassword = await employeesModel.findOne({ email: email });
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
              var updateEmployee = await employeesModel.findByIdAndUpdate(
                { _id: checkoldpassword["id"] },
                {
                  password,
                },
                { new: true }
              );
              if (updateEmployee != null) {
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
  };
module.exports = { getEmployeeInfo, register, login, forgot, updatepass };
