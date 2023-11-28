const membershipcodesRouter = require("express").Router(),
  check = require("express-validator").check,
  { render, addMC } = require("../controller/membershipcodes.controller");
// Add :
membershipcodesRouter.get(
  "/create",
  render
);
// Create :
membershipcodesRouter.post(
  "/create",
  check("MC")
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 15 })
    .withMessage("Error: Please enter a valid membership code"),
  addMC
);
module.exports = membershipcodesRouter;
