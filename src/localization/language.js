const en = require("./languages/en"),
  ar = require("./languages/ar"),
  ku = require("./languages/ku"),
  tur = require("./languages/tur"),
  getLanguage = (code) => {
    if (code == "ar") return ar;
    if (code == "ku") return ku;
    if (code == "tur") return tur;
    return en;
  };
module.exports = getLanguage;
