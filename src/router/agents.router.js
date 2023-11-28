const agentsRouter = require("express").Router(),
  check = require("express-validator").check,
  {
    verify,
    checkMC,
    register,
    checkEmployees,
    login,
    forgot,
    getInfo,
    deleteAccount,
  } = require("../controller/agents.controller");
// verify
agentsRouter.post(
  "/verify/:type",
  check("email").not().isEmpty().isEmail(),
  check("language").not().isEmpty().isString(),
  verify
);
// checkMC
agentsRouter.post(
  "/CMC",
  check("MC").not().isEmpty().isString(),
  check("email").not().isEmpty().isEmail(),
  check("language").not().isEmpty().isString(),
  checkMC
);
// register
agentsRouter.post(
  "/register",
  check("MC").not().isEmpty().isString(),
  check("email").not().isEmpty().isEmail(),
  check("password").isLength({ min: 8 }),
  check("businessName").not().isEmpty().isString(),
  check("desc").not().isEmpty().isString(),
  check("nameowner").not().isEmpty().isString(),
  check("nicknameowner").not().isEmpty().isString(),
  check("employees").not().isEmpty().isNumeric(),
  check("license").not().isEmpty().isString(),
  check("discount").not().isEmpty().isNumeric(),
  check("earn").not().isEmpty().isNumeric(),
  check("country").not().isEmpty().isString(),
  check("governorate").not().isEmpty().isString(),
  check("services").not().isEmpty().isString(),
  check("currency").not().isEmpty().isString(),
  check("location").not().isEmpty().isURL(),
  check("firstNumber").not().isEmpty().isLength({ min: 9 }),
  check("secondNumber").not().isEmpty().isLength({ min: 9 }),
  check("logo").not().isEmpty().isObject(),
  check("language").not().isEmpty().isString(),
  register
);
// register/employees
agentsRouter.post(
  "/register/employees",
  check("email").not().isEmpty().isEmail(),
  check("language").not().isEmpty().isString(),
  checkEmployees
);
// login
agentsRouter.post(
  "/login",
  check("email").not().isEmpty().isEmail(),
  check("password").isLength({ min: 8 }),
  check("language").not().isEmpty().isString(),
  login
);
// forgot
agentsRouter.post(
  "/forgot",
  check("email").not().isEmpty().isEmail(),
  check("password").isLength({ min: 8 }),
  check("vpassword")
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      if (value == req.body.password) {
        return true;
      } else {
        return false;
      }
    }),
  check("language").not().isEmpty().isString(),
  forgot
);
// info
agentsRouter.post(
  "/info",
  check("id").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  getInfo
);
// deleteAccount
agentsRouter.post(
  "/delete",
  check("id").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  deleteAccount
);
module.exports = agentsRouter;
