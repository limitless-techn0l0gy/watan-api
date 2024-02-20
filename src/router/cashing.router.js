const cashingRouter = require("express").Router(),
  check = require("express-validator").check,
  { getEarning, editEarning, getCashing, editCashing } = require('../utils/xlsx');
cashingRouter.get("/earning", getEarning);
cashingRouter.post("/earning",
  check("user").not().isEmpty().isString(),
  check("password").isLength({ min: 8 }),
  check("value").not().isEmpty().isNumeric(),
  check("language").not().isEmpty().isString(),
  editEarning);
cashingRouter.get("/:cu", getCashing);
cashingRouter.post("/edit",
  check("user").not().isEmpty().isString(),
  check("password").isLength({ min: 8 }),
  check("cu").not().isEmpty().isString(),
  check("value").not().isEmpty().isNumeric(),
  check("language").not().isEmpty().isString(),
  editCashing);
module.exports = cashingRouter;