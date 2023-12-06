const commerceModel = require("../model/commerce.model"),
  { genCode } = require("../mail/mail"),
  translate = require("translate-google"),
  genDiscount = (ammount, discount, appEarn) => {
    var disc = parseInt(discount),
      earn = parseInt(appEarn),
      ta = parseInt(ammount),
      totalDiscount = disc + earn,
      taad = ta - (ta * totalDiscount) / 100,
      earnings = (ta * earn) / 100;
    return { taad, earnings };
  },
  checkSerialNo = async (serialNo) => {
    var existSerialNo = await commerceModel.findOne({ serialNo: serialNo });
    if (existSerialNo == null) {
      return true;
    } else {
      return false;
    }
  },
  genSerialNo = async (n) => {
    var filter,
      name,
      serialNo,
      check,
      i = 0,
      code;
    await translate(n, { to: "en" })
      .then((res) => {
        if (res != undefined) {
          filter = res.replace(" ", "");
        } else {
          filter = "bill";
        }
        name = filter;
      })
      .catch((err) => {
        name = "bill";
      });
    while (i <= 1000) {
      code = genCode();
      serialNo = name + "_" + code;
      check = await checkSerialNo(serialNo);
      if (check) {
        return serialNo;
      }
      i++;
    }
  },
  genPoints = (n) => {
    return Math.floor(n / 5000);
  };

module.exports = { genDiscount, genSerialNo, genPoints };
