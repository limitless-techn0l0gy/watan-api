const MCModel = require("../model/membershipcodes.model"),
  { genCode } = require("../mail/mail"),
  translate = require("translate-google"),
  checkMC = async (MC) => {
    var checkMC = await MCModel.findOne({ MC });
    if (checkMC == null) {
      return true;
    } else {
      return false;
    }
  },
  genMC = async (n, email) => {
    var i = 0,
      name,
      codeName,
      nomCode,
      filter,
      mcHash,
      mcCode,
      mc;
    await translate(n, { to: "en" })
      .then((res) => {
        if (res != undefined) {
          filter = res.replace(" ", "");
        } else {
          filter = "agent";
        }
        name = filter;
      })
      .catch((err) => {
        name = "agent";
      });
    while (i <= 1000) {
      if (name.length > 7) {
        codeName = name.substring(0, 7);
      } else {
        codeName = name;
      }
      nomCode = genCode();
      name = codeName + nomCode;
      mcHash = btoa(email);
      mcCode = mcHash.substring(0, 15 - name.length);
      mc = name + mcCode;
      if (mc.length > 15) {
        var f = name + mcCode;
        mc = f.substring(0, 15);
      }
      if (await checkMC(mc)) {
        return mc;
      }
      i++;
    }
  },
  genExpire = async (duration) => {
    var d = new Date();
    return d.getFullYear + duration;
  };

module.exports = { genMC,genExpire };
