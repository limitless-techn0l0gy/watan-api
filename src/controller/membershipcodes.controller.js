var { code, token, body } = require("../functions/auth");
const MCModel = require("../model/membershipcodes.model"),
  agentModel = require("../model/agents.model"),
  serviceModel = require("../model/services.model"),
  validationResult = require("express-validator").validationResult,
  { mcSend, genCode } = require("../mail/mail"),
  getLanguage = require("../localization/language"),
  { auth } = require("../functions/auth"),
  { genToken } = require("../config/jwt"),
  { genMC } = require("../functions/mc"),
  render = async (req, res) => {
    res.render("membershipcodes");
  },
  mcControll = async (req, res) => {
    var { email, businessName, language } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(language);
    auth(res, lang, validateData, { email, businessName }, async () => {
      var sendIt = true,
        mc,
        createMC,
        existMC = await MCModel.findOne({ email });
      if (existMC == null) {
        mc = await genMC(mc, email);
        createMC = await MCModel.create({
          MC: mc,
          email,
          expireIn: {},
          name: businessName,
        });
      } else {
        if (existMC.name == businessName) {
          mc = existMC["MC"];
        } else {
          mc = `${lang.exist} (${existMC["MC"]}) : <br /> ${lang.mc_change_msg}`;
          sendIt = false;
        }
      }
      if (sendIt) {
        var mail = await mcSend(email, mc, lang),
          msgStatus = mail.response.includes("OK");
        if (msgStatus) {
          if (existMC == null && createMC != null) {
            body = {
              success: true,
              msg: createMC["MC"],
            };
          } else {
            body = {
              success: true,
              msg: lang.exist + " " + existMC["MC"],
            };
          }
          code = 200;
        } else {
          body = {
            success: false,
            msg: lang.ce,
          };
          code = 500;
        }
      } else {
        body = {
          success: false,
          msg: mc,
        };
        code = 200;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  renew = async (req, res) => {
    var { email, businessName, language } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(language);
    auth(
      res,
      lang,
      validateData,
      { email, businessName },
      async () => {
        
      }
    );
  },
  mcDelete = async (req, res) => {
    var { email, MC, businessName, language } = req.body,
      validateData = validationResult(req).array(),
      lang = getLanguage(language);
    auth(
      res,
      lang,
      validateData,
      { email, MC, businessName, language },
      async () => {
        var existMC = await MCModel.findOne({ MC, email });
        if (existMC != null) {
          var deleteMC = await MCModel.findOneAndDelete({ email });
          if (deleteMC != null) {
            body = { success: true, msg: lang.deleted };
            code = 200;
          } else {
            body = { success: false, msg: lang.unknown_error };
            code = 500;
          }
        } else {
          body = { success: false, msg: lang.not_found };
          code = 404;
        }
        token = genToken(body);
        res.status(code).json({ token });
      }
    );
  };
// setInterval(async () => {
//   var checkMC = await MCModel.find();
//   if (checkMC != null) {
//     checkMC.forEach(async (value) => {
//       if (value["agent_id"] == undefined || value["agent_id"] == null) {
//         await MCModel.findOneAndDelete({ email: value["email"] });
//       }
//     });
//   }
// }, 60 * 60 * 24 * 30);
module.exports = { render, mcControll, renew, mcDelete };
