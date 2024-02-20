var { code, token, body } = require("../functions/auth");
const userModel = require("../model/users.model"),
  model = userModel,
  validationResult = require("express-validator").validationResult,
  { genToken } = require("../config/jwt"),
  { send, genCode } = require("../mail/mail"),
  getLanguage = require("../localization/language"),
  { genUserID } = require("../functions/userid"),
  { auth, hashString, compareString } = require("../functions/auth"),
  verify = async (req, res) => {
    var { email } = req.body,
      reqType = req.params.type,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { email, reqType }, async () => {
      userExist = await model.findOne({ email });
      if (userExist != null && reqType == "register") {
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
        var mail = await send(email, subject, msg_code, lang, "u"),
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
            msg: lang.ea,
            success: false,
          };
          code = 400;
        }
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  uid = async (req, res) => {
    var {
      userId
    } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { userId }, async () => {
      var exist = await model.findOne({ userID: userId });
      if (exist) {
        body = {
          success: true,
          data: exist
        };
        code = 200;
      } else {
        body = {
          success: false,
          msg: lang.not_found
        };
        code = 404;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  register = async (req, res) => {
    var {
      name,
      nickname,
      email,
      phone,
      password,
      gender,
      country,
      governorate,
      currency,
      points,
    } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(
      res,
      lang,
      validateData,
      {
        name,
        nickname,
        email,
        phone,
        password,
        gender,
        country,
        governorate,
        currency,
        points,
      },
      async () => {
        var existUser = await model.findOne({ email });
        if (existUser != null) {
          body = {
            success: false,
            msg: lang.exist,
          };
          code = 200;
        } else {
          var isUnique = true;
          checkPhone = await model.find();
          if (checkPhone.length > 0) {
            checkPhone.forEach((value) => {
              if (phone["number"] == value["phone"]["number"]) isUnique = false;
            });
          }
          if (isUnique) {
            var userID = await genUserID(email),
              hashPassword = await hashString(password);
            password = hashPassword;
            var newUser = await model.create({
              userID,
              name,
              nickname,
              email,
              phone,
              password,
              gender,
              country,
              governorate,
              currency,
              points,
              fav: [],
            });
            if (newUser != null) {
              body = {
                success: true,
                id: newUser["id"],
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
              msg: lang.exist_number,
            };
            code = 401;
          }
        }
        token = genToken(body);
        res.status(code).json({ token });
      }
    );
  },
  login = async (req, res) => {
    var { email, password } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { email, password }, async () => {
      var userCheck = await model.findOne({ email });
      if (userCheck != null) {
        var isMatch = await compareString(password, userCheck["password"]);
        if (isMatch) {
          body = {
            success: true,
            id: userCheck["id"],
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
  getInfo = async (req, res) => {
    var { id } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { id }, async () => {
      var userData =
        await model.findById({ _id: id }).populate('commerce.commerce_id').populate('commerce.service_id');
      if (userData == null) {
        body = { success: false, msg: lang.not_found };
        code = 404;
      } else {
        if (userData["commerce"].length > 0) {
          var newPoints = 0,
            lastPoints = userData["points"];
          userData["commerce"].forEach((value, index, array) => {
            newPoints += value["points"];
          });
          if (lastPoints != newPoints) {
            var userDataUpdate = await model.findOneAndUpdate(
              { _id: id },
              { points: newPoints },
              { new: true }
            );
            if (userDataUpdate != null) {
              userData =
                await model.findById({ _id: id }).populate('commerce.commerce_id').populate('commerce.service_id');
            }
          }
        }
        console.log(userData);
        body = {
          success: true,
          data: userData,
        };
        code = 200;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  deleteAccount = async (req, res) => {
    var { id } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { id }, async () => {
      var userData = await model.findById({ _id: id });
      if (userData == null) {
        body = { success: false, msg: lang.not_found };
        code = 404;
      } else {
        userData = await model.findOneAndDelete({ _id: id });
        body = {
          success: true,
          data: lang.deleted,
        };
        code = 200;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  fav = async (req, res) => {
    var { id, service_id } = req.body,
      validateData = validationResult(req).array(),
      reqType = req.params.type,
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { id, service_id, reqType }, async () => {
      var userData = await model.findOne({ _id: id }).populate('fav');
      if (userData == null) {
        body = { success: false, msg: lang.not_found };
        code = 404;
      } else {
        if (reqType == "get") {
          if (userData["fav"].length > 0) {
            body = { success: true, data: userData["fav"] };
            code = 200;
          } else {
            body = { success: false, msg: lang.empty_fav };
            code = 404;
          }
        } else {
          var newFav = [], exist = false;
          if (userData["fav"].length > 0) {
            if (reqType != "remove") {
              userData["fav"].forEach(id => {
                if (id == service_id) {
                  exist = true;
                }
                newFav.push(id);
              });
            } else {
              userData["fav"].forEach(id => { if (id["id"] != service_id) { newFav.push(id); } });
            }
          }
          if (reqType == "add" && exist == false) {
            newFav.push(service_id);
          }
          if (exist == false) {
            var updateUserData = await model.findByIdAndUpdate({ _id: id }, { fav: newFav }, { new: true });
            if (updateUserData != null) {
              body = { success: true, data: updateUserData, };
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
              msg: lang.exist,
            };
            code = 200;
          }
        }
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  };

module.exports = { verify, uid, register, login, forgot, getInfo, deleteAccount, fav };
