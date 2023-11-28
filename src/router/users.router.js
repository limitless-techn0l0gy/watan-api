const usersRouter = require("express").Router(),
  check = require("express-validator").check,
  {
    verify,
    register,
    login,
    forgot,
    getInfo,
    deleteAccount,
  } = require("../controller/users.controller");
// verify
usersRouter.post(
  "/verify/:type",
  check("email").not().isEmpty().isEmail(),
  check("language").not().isEmpty().isString(),
  verify
);
// register
usersRouter.post(
  "/register",
  check("name").not().isEmpty().isString(),
  check("nickname").not().isEmpty().isString(),
  check("email").not().isEmpty().isEmail(),
  check("phone").not().isEmpty().isLength({ min: 9 }),
  check("password").isLength({ min: 8 }),
  check("gender").not().isEmpty().isString(),
  check("country").not().isEmpty().isString(),
  check("governorate").not().isEmpty().isString(),
  check("currency").not().isEmpty().isString(),
  check("points").not().isEmpty().isInt(),
  check("language").not().isEmpty().isString(),
  register
);
// login
usersRouter.post(
  "/login",
  check("email").not().isEmpty().isEmail(),
  check("password").isLength({ min: 8 }),
  check("language").not().isEmpty().isString(),
  login
);
// forgot
usersRouter.post(
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
usersRouter.post(
  "/info",
  check("id").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  getInfo
);
// deleteAccount
usersRouter.post(
  "/delete",
  check("id").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  deleteAccount
);
module.exports = usersRouter;
