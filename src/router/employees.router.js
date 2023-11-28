const employeesRouter = require("express").Router(),
  check = require("express-validator").check,
  {
    verify,
    register,
    login,
    forgot,
    getInfo,
    deleteAccount,
  } = require("../controller/employees.controller");
// verify
employeesRouter.post(
  "/verify/:type",
  check("email").not().isEmpty().isEmail(),
  check("language").not().isEmpty().isString(),
  verify
);
// register
employeesRouter.post(
  "/register",
  check("email").not().isEmpty().isEmail(),
  check("agentEmail").not().isEmpty().isEmail(),
  check("password").isLength({ min: 8 }),
  check("name").not().isEmpty().isString(),
  check("nickname").not().isEmpty().isString(),
  check("country").not().isEmpty().isString(),
  check("governorate").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  register
);
// login
employeesRouter.post(
  "/login",
  check("email").not().isEmpty().isEmail(),
  check("password").isLength({ min: 8 }),
  check("language").not().isEmpty().isString(),
  login
);
// forgot
employeesRouter.post(
  "/forgot",
  check("email").not().isEmpty().isEmail(),
  check("password").isLength({ min: 8 }),
  check("vpassword")
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      if (value == req.body.password) {
        return true;
      } else {
        throw "Erorr: Password validation";
      }
    }),
  forgot
);
// info
employeesRouter.post(
  "/info",
  check("id").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  getInfo
);
// delete
employeesRouter.post(
  "/delete",
  check("id").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  deleteAccount
);
module.exports = employeesRouter;
