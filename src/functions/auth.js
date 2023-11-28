var code, body, token;
const bcrypt = require("bcrypt"),
  { genToken } = require("../config/jwt"),
  auth = (res, lang, validate, reqBody, fun = async (code) => {}) => {
    try {
      if (validate.length > 0) {
        body = {
          success: false,
          msg: lang.ea,
          e: validate,
        };
        console.log(validate);
        var token = genToken(body);
        res.status(422).json(token);
      } else {
        fun();
      }
    } catch (error) {
      body = {
        success: false,
        msg: lang.ce,
      };
      token = genToken(body);
      res.status(400).json(token);
    }
  },
  hashString = async (password) => {
    var salt = await bcrypt.genSalt(10),
      hashpass = await bcrypt.hash(password, salt);
    return hashpass;
  },
  comparePassword = async (requestPassword, password) => {
    var isMatch = await bcrypt.compare(requestPassword, password);
    return isMatch;
  };
module.exports = { code, body, token, auth, hashString, comparePassword };
