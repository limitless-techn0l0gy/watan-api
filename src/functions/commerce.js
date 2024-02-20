const commerceModel = require("../model/commerce.model"),
  { genCode } = require("../mail/mail"),
  genDiscount = (ammount, discount, earnValue) => {
    var intDisc = parseInt(discount),
      disc = intDisc + earnValue,
      ta = parseInt(ammount),
      totalDiscount = (ta * disc) / 100,
      taad = ta - totalDiscount,
      earnings = (ta * earnValue) / 100;
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
  genSerialNo = async () => {
    var serialNo,
      check,
      i = 0,
      code;
    while (i <= 1000) {
      code = genCode();
      serialNo = "bill" + code;
      check = await checkSerialNo(serialNo);
      if (check) {
        return serialNo;
      }
      i++;
    }
  },
  genPoints = (n, earnValue) => {
    var points = (n * earnValue) / 100;
    return points;
  },
  getCurrency = async (currency) => {
    var cu = 1;
    if (currency != "usd") {
      var getReq = await fetch(`http://127.0.0.1:8080/app/cashing/${currency}`),
        getRes = await getReq.json(),
        cu = getRes["data"];
      return cu;
    }
    return cu;
  },
  getAppEarnings = async () => {
    var getReq = await fetch(`http://127.0.0.1:8080/app/cashing/earning`),
      getRes = await getReq.json(),
      earn = getRes["data"];
    return earn;
  };

module.exports = { genDiscount, genSerialNo, checkSerialNo, genPoints, getCurrency, getAppEarnings };
