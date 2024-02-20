require("dotenv").config();
var time = Date.now(),
  redirectUrl = "http://192.168.1.101:8080/app/mc",
  body,
  token;
const zaincashRouter = require("express").Router(),
  check = require("express-validator").check,
  cors = require("cors"),
  jwt = require("jsonwebtoken"),
  request = require("request"),
  { genZainCashToken } = require("../config/jwt");
zaincashRouter.use(cors());
var initUrl = "https://test.zaincash.iq/transaction/init";
var requestUrl = "https://test.zaincash.iq/transaction/pay?id=";
if (process.env.PRODUCTION === "true") {
  initUrl = "https://api.zaincash.iq/transaction/init";
  requestUrl = "https://api.zaincash.iq/transaction/pay?id=";
}
zaincashRouter.get(
  "/request",
  check("amount")
    .not()
    .isEmpty()
    .isNumeric()
    .custom((value, { req }) => {
      if (value > 250) {
        return true;
      } else {
        return false;
      }
    }),
  check("orderId").not().isEmpty().isString(),
  check("serviceType").not().isEmpty().isString(),
  (req, res) => {
    var { amount, orderId, serviceType, language } = req.body;
    body = {
      amount,
      serviceType,
      msisdn: process.env.MSISDN,
      orderId,
      redirectUrl,
      iat: time,
      exp: time + 60 * 60 * 4,
    };
    token = genZainCashToken(body);
    const postData = {
      token: token,
      merchantId: process.env.MERCHANTID,
      lang: language,
    },
      requestOptions = {
        method: "POST",
        uri: initUrl,
        body: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json",
        },
      };
    request(requestOptions, (error, response) => {
      //  Getting the operation id
      const OperationId = JSON.parse(response.body).id;
      //  Redirect the user to ZC payment Page
      res.writeHead(302, {
        Location: requestUrl + OperationId,
      });
      res.end();
    });
  }
);

//  Handeling the redierct
zaincashRouter.get("redirect", (req, res) => {
  token = req.body.token;
  if (token) {
    try {
      var decoded = jwt.verify(token, process.env.SECRET);
    } catch (err) { }
    if (decoded.status == "success") {
    } else {
    }
  }
});
module.exports = zaincashRouter;
