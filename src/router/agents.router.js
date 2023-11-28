const agentsRouter = require("express").Router(),
  check = require("express-validator").check,
  {
    getAgentInfo,
    CheckMembershipCode,
    register,
    verify,
    Login,
    updatepass,
    forgot,
    employeeCheck,
    deleteaccount,
  } = require("../controller/agents.controller");
// info
agentsRouter.post(
  "/info",
  check("id")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid id"),
  getAgentInfo
);
// CheckMembershipCode
agentsRouter.post(
  "/CMC",
  check("MC")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid membership code"),
  CheckMembershipCode
);
// register
agentsRouter.post(
  "/register",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Error: Please enter a valid email"),
  register
);
// register/verify
agentsRouter.post(
  "/register/verify",
  check("MC_id")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid member ship code"),
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Error: Please enter a valid email"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("The password must consist of 8 digits"),
  check("businessName")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid business name"),
  check("nameowner")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid owner name"),
  check("nicknameowner")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid owner nickname"),
  check("usersCount")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid users number"),
  check("license")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid license"),
  check("discount")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid discount"),
  check("earn")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a valid earn"),
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
  check("services")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a services type"),
  check("currency")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Error: Please enter a currency type"),
  check("location")
    .not()
    .isEmpty()
    .isURL()
    .withMessage("Error: Please enter a valid location"),
  check("firstNumber")
    .not()
    .isEmpty()
    .isLength({ min: 9 })
    .withMessage("Error: Please enter a valid first number"),
  check("secondNumber")
    .not()
    .isEmpty()
    .isLength({ min: 9 })
    .withMessage("Error: Please enter a valid second number"),
  verify
);
// register/employee
agentsRouter.post(
  "/register/employee",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Error: Please enter a valid email"),
  employeeCheck
);
// login
agentsRouter.post(
  "/login",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Error: Please enter a valid email"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("The password must consist of 8 digits"),
  Login
);
// forgot
agentsRouter.post(
  "/forgot",
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Error: Please enter a valid email"),
  forgot
);
// forgot/update
agentsRouter.post(
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
// deleteaccount
agentsRouter.post(
  "/deleteaccount",
  check("id").not().isEmpty().withMessage("please enter a valid id"),
  deleteaccount
);
module.exports = agentsRouter;
