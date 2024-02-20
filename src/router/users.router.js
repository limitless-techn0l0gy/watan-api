const usersRouter = require("express").Router(),
  check = require("express-validator").check,
  {
    verify,
    uid,
    register,
    login,
    forgot,
    getInfo,
    deleteAccount,
    fav,
  } = require("../controller/users.controller");
// verify
usersRouter.post(
  "/verify/:type",
  check("email").not().isEmpty().isEmail(),
  check("language").not().isEmpty().isString(),
  verify
);
// checkUserId
usersRouter.post(
  "/uid",
  check("userId").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  uid
);
// register
usersRouter.post(
  "/register",
  check("name").not().isEmpty().isString(),
  check("nickname").not().isEmpty().isString(),
  check("email").not().isEmpty().isEmail(),
  check("phone").not().isEmpty().isObject(),
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
// fav
usersRouter.post(
  "/fav/:type",
  check("id").not().isEmpty().isString(),
  check("service_id").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  fav
);
module.exports = usersRouter;
