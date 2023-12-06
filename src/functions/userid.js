const userModel = require("../model/users.model"),
  { genCode } = require("../mail/mail"),
  translate = require("translate-google"),
  checkUserID = async (userID) => {
    var checkUserID = await userModel.findOne({ userID });
    if (checkUserID == null) {
      return true;
    } else {
      return false;
    }
  },
  genUserID = async (n, email) => {
    var i = 0,
      name,
      nameCode,
      nomCode,
      filter,
      hashed,
      hashName,
      userID;
    await translate(n, { to: "en" })
      .then((res) => {
        if (res != undefined) {
          filter = res.replace(" ", "");
        } else {
          filter = "user";
        }
        name = filter;
      })
      .catch((err) => {
        name = "user";
      });
    while (i <= 1000) {
      if (name.length > 7) {
        nameCode = name.substring(0, 7);
      } else {
        nameCode = name;
      }
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