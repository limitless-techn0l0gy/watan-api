require("dotenv").config();
const jwt = require("jsonwebtoken"),
  genToken = (body) => {
    var token = jwt.sign(body, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    return token;
  },
  genZainCashToken = (body) => {
    var token = jwt.sign(body, process.env.SECRET);
    return token;
  };
module.exports = { genToken, genZainCashToken };
