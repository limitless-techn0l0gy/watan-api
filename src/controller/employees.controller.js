var { code, token, body } = require("../functions/auth");
const employeesModel = require("../model/employees.model"),
  model = employeesModel,
  agentModel = require("../model/agents.model"),
  serviceModel = require("../model/services.model"),
  MCModel = require("../model/membershipcodes.model"),
  validationResult = require("express-validator").validationResult,
  { genToken } = require("../config/jwt"),
  { send, genCode } = require("../mail/mail"),
  getLanguage = require("../localization/language"),
  { auth, hashString, compareString } = require("../functions/auth"),
  /*
    {
      "email": "alaaqutfa.work@gmail.com",
      "language": "ar"
    }
  */
  verify = async (req, res) => {
    var { email } = req.body,
      reqType = req.params.type,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { email, reqType }, async () => {
      existEmployee = await model.findOne({ email });
      if (existEmployee != null && reqType == "register") {
        body = {
          success: false,
          msg: lang.exist,
        };
        code = 200;
      } else {
        var msg_code = genCode(),
          subject;
        if (reqType == "register") {
          subject = lang.register_msgSubject;
        } else {
          subject = lang.forgot_msgSubject;
        }
        var mail = await send(email, subject, msg_code, lang, "a"),
          msgStatus = mail.response.includes("OK");
        if (msgStatus) {
          body = {
            success: true,
            email: email,
            code: msg_code,
          };
          code = 200;
        } else {
          body = {
            success: false,
            msg: lang.ea,
          };
          code = 400;
        }
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  /*
    {
      "email": "",
      "agentEmail": "",
      "password": "",
      "name": "",
      "nickname": "",
      "country": "",
      "governorate": "",
      "language": "ar"
    }
  */
  register = async (req, res) => {
    var { email, agentEmail, password, name, nickname, country, governorate } =
        req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(
      res,
      lang,
      validateData,
      { email, agentEmail, password, name, nickname, country, governorate },
      async () => {
        var agentData = await agentModel.findOne({ email: agentEmail });
        if (agentData != null && agentData["email"] != email) {
          var serviceData = await serviceModel.findOne({
              agent_id: agentData["id"],
            }),
            hashPassword = await hashString(password);
          password = hashPassword;
          var activeUsersList = [],
            employeeData = {
              agent_id: agentData["id"],
              email,
              password,
              name,
              nickname,
              country,
              governorate,
            };
          if (serviceData["availableEmployees"].length < 5) {
            var existEmployee = await employeesModel.findOne({ email });
            if (existEmployee == null) {
              var newEmployee = await employeesModel.create(employeeData);
              if (newEmployee != null) {
                serviceData["availableEmployees"].forEach((user) => {
                  activeUsersList.push(user);
                });
                activeUsersList.push(newEmployee["id"]);
                var updateServices = await serviceModel.findByIdAndUpdate(
                  { _id: serviceData["id"] },
                  {
                    availableEmployees: activeUsersList,
                  },
                  { new: true }
                );
                if (updateServices != null) {
                  body = {
                    success: true,
                    id: agentData["id"],
                    employee: newEmployee["id"],
                    service: updateServices["id"],
                  };
                  code = 200;
                } else {
                  body = {
                    success: false,
                    mag: lang.unknown_error,
                  };
                  code = 500;
                }
              } else {
                body = {
                  success: false,
                  mag: lang.unknown_error,
                };
                code = 500;
              }
            } else {
              body = {
                success: true,
                msg: lang.exist,
              };
              code = 200;
            }
          } else {
            body = {
              success: false,
              msg: lang.employees_maximum,
            };
            code = 200;
          }
        } else {
          body = {
            success: false,
            msg: lang.ce,
          };
          code = 500;
        }
        token = genToken(body);
        res.status(code).json({ token });
      }
    );
  },
  /*
    {
      "email": "alaaqutfa.work@gmail.com",
      "password": "A123456a@",
      "language": "ar"
    }
  */
  login = async (req, res) => {
    var { email, password } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { email, password }, async () => {
      var employeeCheck = await model.findOne({ email });
      if (employeeCheck != null) {
        var agentData = await agentModel.findOne({
            _id: employeeCheck["agent_id"],
          }),
          serviceData = await serviceModel.findOne({
            agent_id: employeeCheck["agent_id"],
          }),
          isMatch = await compareString(password, employeeCheck["password"]);
        if (isMatch && serviceData != null && agentData != null) {
          body = {
            success: true,
            id: agentData["id"],
            employee: employeeCheck["id"],
            service: serviceData["id"],
            success: true,
          };
          code = 200;
        } else {
          body = {
            success: false,
            msg: lang.password_not_correct,
          };
          code = 400;
        }
      } else {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  /*
    {
      "email": "alaaqutfa.work@gmail.com",
      "password": "A123456a@",
      "vpassword": "A123456a@",
      "language": "en"
    }
  */
  forgot = async (req, res) => {
    var { email, password } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { email, password }, async () => {
      var oldPassword = await model.findOne({ email });
      if (oldPassword != null) {
        const isMatch = await compareString(password, oldPassword["password"]);
        if (!isMatch) {
          var hashpass = await hashString(password);
          password = hashpass;
          var updateAgent = await model.findByIdAndUpdate(
            { _id: oldPassword["id"] },
            {
              password,
            },
            { new: true }
          );
          if (updateAgent != null) {
            body = {
              success: true,
              msg: lang.updated,
            };
          } else {
            body = {
              success: false,
              msg: lang.ce,
            };
          }
        } else {
          body = {
            success: false,
            msg: lang.used_password,
          };
        }
        code = 200;
      } else {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  /*
  {
      "id": "654d38c4e44fa7ae452341cc",
      "language": "ar"
    }
  */
  getInfo = async (req, res) => {
    var { id } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { id }, async () => {
      var employeeData = await model.findById({ _id: id });
      if (employeeData == null) {
        body = { success: false, msg: lang.not_found };
        code = 404;
      } else {
        var agentData = await agentModel.findOne({
          _id: employeeData["agent_id"],
        });
        if (agentData != null) {
          var serviceData = await serviceModel.findOne({
              agent_id: employeeData["agent_id"],
            }),
            agentMC = await MCModel.findOne({
              agent_id: employeeData["agent_id"],
            });
          if (serviceData != null && agentMC != null) {
            body = {
              success: true,
              agent: agentData,
              employee: employeeData,
              service: serviceData,
              mc: agentMC,
            };
            code = 200;
          } else {
            body = {
              success: false,
              msg: lang.unknown_error,
            };
            code = 500;
          }
        } else {
          body = {
            success: false,
            msg: lang.unknown_error,
          };
          code = 500;
        }
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  /*
  {
      "id": "654d38c4e44fa7ae452341cc",
      "language": "ar"
    }
  */
  deleteAccount = async (req, res) => {
    var { id } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { id }, async () => {
      var employeeData = await model.findById({ _id: id });
      if (employeeData == null) {
        body = { success: false, msg: lang.not_found };
        code = 404;
      } else {
        var agentService = await serviceModel.findOne({
          agent_id: employeeData["agent_id"],
        });
        if (agentService != null) {
          var availableEmployees = agentService["availableEmployees"],
            deletedEmployee = [],
            otherEmployees = [];
          if (availableEmployees.length > 0) {
            availableEmployees.forEach(async (id, index) => {
              if (id != employeeData["id"]) {
                otherEmployees.push(id);
              } else {
                deletedEmployee = await model.findOneAndDelete({
                  _id: id,
                });
              }
            });
            console.log(deletedEmployee);
            var _id = agentService["id"];
            agentService = await serviceModel.findByIdAndUpdate(
              { _id },
              {
                availableEmployees: otherEmployees,
              },
              { new: true }
            );
          }
          body = {
            success: true,
            agentService,
            otherEmployees,
          };
          code = 200;
        } else {
          body = { success: false, msg: lang.unknown_error };
          code = 500;
        }
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  };
module.exports = { verify, register, login, forgot, getInfo, deleteAccount };
