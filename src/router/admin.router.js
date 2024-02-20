const adminRouter = require("express").Router(),
  check = require("express-validator").check,
  { create, getRegister, exist, register, getLogin, login, getForgot, forgot, getInfo, deleteAccount, home, } = require("../controller/admin.controller");
adminRouter.get(
  "/create/:password",
  create
);
adminRouter.get("/register/:token", getRegister);
adminRouter.post(
  "/exist",
  check("user").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  exist
);
adminRouter.post(
  "/register",
  check("user").not().isEmpty().isString(),
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
  check("language").not().isEmpty().isString(),
  register
);
adminRouter.get("/login/:user", getLogin);
adminRouter.post(
  "/login",
  check("user").not().isEmpty().isString(),
  check("password").isLength({ min: 8 }),
  check("language").not().isEmpty().isString(),
  login
);
adminRouter.get(
  "/forgot/:user/:password", getForgot
);
adminRouter.post(
  "/forgot",
  check("user").not().isEmpty().isString(),
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
adminRouter.get(
  "/home/:password/:user",
  home
);
adminRouter.post(
  "/info",
  check("user").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  getInfo
);
adminRouter.post(
  "/delete",
  check("user").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  deleteAccount
);
module.exports = adminRouter;