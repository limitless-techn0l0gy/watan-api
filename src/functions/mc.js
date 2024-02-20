const MCModel = require("../model/membershipcodes.model"),
  { genCode } = require("../mail/mail"),
  checkMC = async (MC) => {
    var checkMC = await MCModel.findOne({ MC });
    if (checkMC == null) {
      return true;
    } else {
      return false;
    }
  },
  genMC = async (email) => {
    var i = 0,
      name,
      nameCode,
      nomCode,
      mcHash,
      mcCode,
      mc;
    while (i <= 1000) {
      nameCode = "agent";
      nomCode = genCode();
      name = nameCode + nomCode;
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
