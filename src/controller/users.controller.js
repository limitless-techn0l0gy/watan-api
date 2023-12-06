var { code, token, body } = require("../functions/auth");
const userModel = require("../model/users.model"),
  model = userModel,
  validationResult = require("express-validator").validationResult,
  { genToken } = require("../config/jwt"),
  { send, genCode } = require("../mail/mail"),
  getLanguage = require("../localization/language"),
  { genUserID } = require("../functions/userid"),
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
  /*
    {
      "name":"",
      "nickname":"",
      "email":"",
      "phone":"",
      "password":"",
      "gender":"",
      "country":"",
      "governorate":"",
      "currency":"",
      "points":""
    }
  */
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
          var checkPhone = await model.find(),
            existPhone = false;
          if (checkPhone != null && checkPhone.length > 0) {
            checkPhone.forEach((value, index, array) => {
              if (value["phone"]["number"] == phone["number"]) {
                existPhone = true;
              }
            });
          }
          if (existPhone == true) {
            body = {
              success: false,
              msg: lang.exist_number,
            };
            code = 200;
          } else {
            var userID = await genUserID(name, email),
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
          }
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
    }
  */
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
  /*
    {
      "email": "alaaqutfa.work@gmail.com",
      "password": "A123456a@",
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
      "id": "6549f376000cd9fda4f85146",
    }
  */
  getInfo = async (req, res) => {
    var { id } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { id }, async () => {
      var userData = await model.findById({ _id: id });
      if (userData == null) {
        body = { success: false, msg: lang.not_found };
        code = 404;
      } else {
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
  };

module.exports = { verify, register, login, forgot, getInfo, deleteAccount };
