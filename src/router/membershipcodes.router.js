const cors = require("cors"),
  membershipcodesRouter = require("express").Router(),
  check = require("express-validator").check,
  {
    render,
    mcControll,
    renew,
    mcDelete,
  } = require("../controller/membershipcodes.controller");
membershipcodesRouter.use(cors());
// Add :
membershipcodesRouter.get("/", render);
// Create :
membershipcodesRouter.post(
  "/create",
  check("email").not().isEmpty().isEmail(),
  check("businessName").not().isEmpty().isString().isLength({ min: 2 }),
  check("language").not().isEmpty().isString(),
  mcControll
);
// Renew :
membershipcodesRouter.post(
  "/renew",
  check("email").not().isEmpty().isEmail(),
  check("MC").not().isEmpty().isString().isLength({ min: 15, max: 15 }),
  check("duration").not().isEmpty().isNumeric(),
  check("language").not().isEmpty().isString(),
  renew
);
// Delete :
membershipcodesRouter.post(
  "/delete",
  check("email").not().isEmpty().isEmail(),
  check("MC").not().isEmpty().isString().isLength({ min: 15, max: 15 }),
  check("businessName").not().isEmpty().isString().isLength({ min: 2 }),
  check("language").not().isEmpty().isString(),
  mcDelete
);
module.exports = membershipcodesRouter;
