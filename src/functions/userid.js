const userModel = require("../model/users.model"),
  serviceModel = require("../model/services.model"),
  { genCode } = require("../mail/mail"),
  checkUserID = async (userID) => {
    var checkUserID = await userModel.findOne({ userID });
    if (checkUserID == null) {
      return true;
    } else {
      return false;
    }
  },
  genUserID = async (email) => {
    var i = 0,
      nameCode,
      nomCode,
      hashed,
      hashName,
      userID;
    while (i <= 1000) {
      nameCode = "user";
      nomCode = genCode();
      hashed = btoa(email);
      mcCode = nameCode + nomCode;
      hashName = hashed.substring(0, 15 - mcCode.length);
      userID = mcCode + hashName;
      if (userID.length > 15) {
        var replace = userID.substring(0, 15);
        userID = replace;
      }
      if (await checkUserID(userID)) {
        return userID;
      }
      i++;
    }
  };

module.exports = { genUserID };