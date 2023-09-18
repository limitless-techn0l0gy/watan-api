const employeesRouter = require("express").Router(),
  check = require("express-validator").check,
  {
    getEmployeeInfo,
    register,
    login,
    forgot,
    updatepass,
  } = require("../controller/employees.controller");
// info
employeesRouter.post(
  "/info",
  check("id")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid id"),
  getEmployeeInfo
);
// register
employeesRouter.post(
  "/register",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Error: Please enter a valid email"),
  check("agentEmail")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Error: Please enter a valid agent email"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("The password must consist of 8 digits"),
  check("name")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid name"),
  check("nickname")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid nickname"),
  check("country")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a country name"),
  check("governorate")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a governorate name"),
  register
);
// login
employeesRouter.post(
  "/login",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Error: Please enter a valid email"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("The password must consist of 8 digits"),
  login
);
// forgot
employeesRouter.post(
  "/forgot",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Error: Please enter a valid email"),
  forgot
);
// forgot/updatepass
employeesRouter.post(
  "/forgot/update",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("please enter a valid email"),
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
module.exports = employeesRouter;
