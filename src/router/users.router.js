const router = require("express").Router(),
  check = require("express-validator").check,
  {
    signup,
    verify,
    sendMsg,
    updatepass,
    logIn,
    deleteUser,
  } = require("../controller/users.controller");
router.post(
  "/login",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please enter a valid email"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("The password must consist of 8 digits"),
  logIn
);
router.post(
  "/signup",
  check("firstName")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid username"),
  check("lastName")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid username"),
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please enter a valid email"),
  check("phone")
    .isString()
    .isLength({ min: 9 })
    .withMessage("The phone number must consist of 9 digits"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("The password must consist of 8 digits"),
  check("vpassword")
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      if (value == req.body.password) {
        return true;
      } else {
        throw "Erorr: Password validation";
      }
    })
    .withMessage("Please confirm your password"),
  check("date")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid date"),
  check("gender")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid gender"),
  check("country")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid country"),
  check("governorate")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid governorate"),
  signup
);
router.post(
  "/signup/check",
  check("firstName")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid username"),
  check("lastName")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid username"),
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please enter a valid email"),
  check("phone")
    .isString()
    .isLength({ min: 9 })
    .withMessage("The phone number must consist of 9 digits"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("The password must consist of 8 digits"),
  check("date")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid date"),
  check("gender")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid gender"),
  check("country")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid country"),
  check("governorate")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a valid governorate"),
  check("code").isString().withMessage("Verification code not String"),
  check("vcode")
    .custom((value, { req }) => {
      if (value == req.body.code) {
        return true;
      } else {
        throw "Erorr: Verification code not correct";
      }
    })
    .withMessage("Verification code not correct"),
  verify
);
router.post(
  "/sendmsg",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please enter a valid email"),
  sendMsg
);
router.post(
  "/sendmsg/repass",
  check("password")
    .isLength({ min: 8 })
    .withMessage("The password must consist of 8 digits"),
  check("vpassword")
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      if (value == req.body.password) {
        return true;
      } else {
        throw "Erorr: Password validation";
      }
    })
    .withMessage("Please confirm your password"),
  updatepass
);
router.post(
  "/deleteaccount",
  check("id").not().isEmpty().withMessage("please enter a valid id"),
  deleteUser
);

module.exports = router;
// {
// ===static===
//   firstName: "",
//   lastName: "",
//   email: "",
//   phone: "",
//   password: "",
//   date: "",
//   gender: "",
//   country: "",
//   governorate: ""
// }
// {
// ===signup===
//   firstName: "",
//   lastName: "",
//   email: "",
//   phone: "",
//   password: "",
//   vpassword: "",
//   date: "",
//   gender: "",
//   country: "",
//   governorate: ""
// }
// {
// ===verify===
//   firstName: "",
//   lastName: "",
//   email: "",
//   phone: "",
//   password: "",
//   date: "",
//   gender: "",
//   country: "",
//   governorate: ""
//   code: ""
//   vcode: ""
// }
