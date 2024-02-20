var { code, token, body } = require("../functions/auth");
const model = require("../model/admin.model"),
  validationResult = require("express-validator").validationResult,
  { genToken } = require("../config/jwt"),
  getLanguage = require("../localization/language"),
  { auth } = require("../functions/auth"),
  XlsxPopulate = require("xlsx-populate"),
  dirPath = __dirname + "/../storages",
  filePath = `${dirPath}/cashing.xlsx`,
  getEarning = (req, res, next) => {
    XlsxPopulate.fromFileAsync(filePath).then((workbook) => {
      return workbook.sheet("Sheet1").cell("C2").value();
    }).then(data => {
      res.status(200).json({ data });
    }).catch(next);
  },
  editEarning = async (req, res, next) => {
    var { user, password, value } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { user, password, value }, async () => {
      var exist = await model.findOne({ user });
      if (exist == null) {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      } else {
        if (process.env.ADMIN_SECRET == password) {
          XlsxPopulate.fromFileAsync(filePath).then((workbook) => {
            var cel = "C2";
            workbook.sheet("Sheet1").cell(cel).value(value);
            var check = workbook.sheet("Sheet1").cell(cel).value();
            if (check == value) {
              workbook.toFileAsync(filePath);
              return check == value;
            } else {
              return false;
            }
          }).then(data => {
            body = {
              success: data,
              msg: lang.updated,
              value
            };
            code = 200;
            token = genToken(body);
            return res.status(code).json({ token });
          }).catch(next);
        } else {
          body = { success: false, msg: lang.password_not_correct };
          code = 401;
        }
      }
      if (body) {
        token = genToken(body);
        res.status(code).json({ token });
      }
    });
  },
  getCashing = (req, res, next) => {
    var cu = req.params.cu;
    XlsxPopulate.fromFileAsync(filePath).then((workbook) => {
      for (var i = 2; i <= 12; i++) {
        var existingCurrency = workbook.sheet("Sheet1").cell("A" + i).value();
        if (existingCurrency == cu) return workbook.sheet("Sheet1").cell("B" + i).value();
      }
    }).then(data => {
      res.status(200).json({ data });
    }).catch(next);
  },
  editCashing = async (req, res, next) => {
    var { user, password, cu, value } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { user, password, cu, value }, async () => {
      var exist = await model.findOne({ user });
      if (exist == null) {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      } else {
        if (process.env.ADMIN_SECRET == password) {
          XlsxPopulate.fromFileAsync(filePath).then((workbook) => {
            var cel;
            for (var i = 2; i <= 12; i++) {
              var existingCurrency = workbook.sheet("Sheet1").cell("A" + i).value();
              if (existingCurrency == cu) {
                workbook.sheet("Sheet1").cell("B" + i).value(value);
                cel = "B" + i;
              }
            }
            var check = workbook.sheet("Sheet1").cell(cel).value();
            if (check == value) {
              workbook.toFileAsync(filePath);
              return check == value;
            } else {
              return false;
            }
          }).then(data => {
            body = {
              success: data,
              msg: lang.updated,
              value
            };
            code = 200;
            token = genToken(body);
            return res.status(code).json({ token });
          }).catch(next);
        } else {
          body = { success: false, msg: lang.password_not_correct };
          code = 401;
        }
      }
      if (body) {
        token = genToken(body);
        res.status(code).json({ token });
      }
    });
  };
module.exports = { getEarning, editEarning, getCashing, editCashing };

