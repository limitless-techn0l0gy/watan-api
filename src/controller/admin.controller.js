var { code, token, body } = require("../functions/auth");
const adminModel = require("../model/admin.model"),
  model = adminModel,
  validationResult = require("express-validator").validationResult,
  { genToken } = require("../config/jwt"),
  getLanguage = require("../localization/language"),
  { auth, hashString, compareString } = require("../functions/auth"),
  create = async (req, res) => {
    var password = req.params.password;
    if (password == process.env.ADMIN_SECRET) {
      var token = await hashString(password);
      res.redirect(`/app/admin/register/${token}`);
    }
  },
  getRegister = async (req, res) => {
    var token = req.params.token;
    if (await compareString(process.env.ADMIN_SECRET, token)) {
      res.render("admin-register");
    }
  },
  exist = async (req, res) => {
    var { user } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { user }, async () => {
      var exist = await model.findOne({ user });
      if (exist != null) {
        body = {
          success: false,
          msg: lang.exist,
        };
        code = 200;
      } else {
        body = {
          success: true,
        };
        code = 200;
      }
      token = genToken(body);
      res.status(code).json({ token });

    });
  },
  register = async (req, res) => {
    var { user,
      password,
      vpassword } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { user, password, vpassword }, async () => {
      var exist = await model.findOne({ user });
      if (exist != null) {
        body = {
          success: false,
          msg: lang.exist,
        };
        code = 200;
      } else {
        var hashpass = await hashString(password);
        password = hashpass;
        var create = await model.create({
          user, password
        });
        if (create != null) {
          body = { success: true, data: create };
          code = 200;
        } else { body = { success: false, msg: lang.unknown_error }; code = 501; }
      }
      if (body.success == true) {
        token = genToken({ success: true, url: `/app/admin/login/${user}` });
      } else {
        token = genToken(body);
      }
      res.status(code).json({ token });
    });
  },
  getLogin = async (req, res) => {
    var user = req.params.user;
    if (await model.findOne({ user: user }) != null) {
      res.render("admin-login");
    } else {
      res.status(404).render("404");
    }
  },
  login = async (req, res) => {
    var { user, password } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { user, password }, async () => {
      var exist = await model.findOne({ user });
      if (exist == null) {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      } else {
        var isMatch = await compareString(password, exist["password"]);
        if (isMatch == true) {
          body = {
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
      }
      if (body.success == true) {
        var filter = exist["password"].replaceAll("/", "");
        token = genToken({ success: true, url: `/app/admin/home/${filter}/${user}` });
      } else {
        token = genToken(body);
      }
      res.status(code).json({ token });
    });
  },
  getForgot = async (req, res) => {
    var user = req.params.user, password = req.params.password;
    if (await model.findOne({ user }) != null && password == process.env.ADMIN_SECRET) {
      var hashpass = await hashString(password);
      token = hashpass.replaceAll("/", "");
      return res.redirect(`/app/admin/forgot/${token}/${user}`);
    } else if (await model.findOne({ user: password }) != null) {
      return res.render("admin-forgot");
    }
  },
  forgot = async (req, res) => {
    var { user, password } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { user, password }, async () => {
      var oldPassword = await model.findOne({ user });
      if (oldPassword != null) {
        const isMatch = await compareString(password, oldPassword["password"]);
        if (!isMatch) {
          var hashpass = await hashString(password);
          password = hashpass;
          var updateAdmin = await model.findByIdAndUpdate(
            { _id: oldPassword["id"] },
            {
              password,
            },
            { new: true }
          );
          if (updateAdmin != null) {
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
      if (body.success == true) {
        token = genToken({ success: true, url: `/app/admin/login/${user}` });
      } else {
        token = genToken(body);
      }
      res.status(code).json({ token });
    });
  },
  home = async (req, res) => {
    var user = req.params.user,
      password = req.params.password,
      exist = await model.findOne({ user });
    if (exist == null) {
      return res.status(404).render("404");
    } else {
      var filter = exist["password"].replaceAll("/", "");
      if (filter == password) {
        return res.render("admin");
      } else {
        return res.redirect("/");
      }
    }
  },
  getInfo = async (req, res) => {
    var { user } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { user }, async () => {
      var exist = await model.findOne({ user });
      if (exist == null) {
        body = { success: false, msg: lang.not_found };
        code = 404;
      } else {
        body = { success: true, data: exist };
        code = 200;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  deleteAccount = async (req, res) => {
    var { user } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(req.body.language);
    auth(res, lang, validateData, { user }, async () => {
      var exist = await model.findOne({ user });
      if (exist == null) {
        body = { success: false };
        code = 404;
      } else {
        body = { success: true, data: exist };
        code = 200;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  };
module.exports = { create, getRegister, exist, register, getLogin, login, getForgot, forgot, getInfo, deleteAccount, home, };



// $2b$10$VyxCln.G70ePafeFW4ooXu.WBoVDgkJUH1SHkGJyNQeTJNLR9ewh6
// $2b$10$VyxCln.G70ePafeFW4ooXu.WBoVDgkJUH1SHkGJyNQeTJNLR9ewh6