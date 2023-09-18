const serviceRouter = require("express").Router(),
  check = require("express-validator").check,
  {
    upload,
    deleteImg,
    getServices,
  } = require("../controller/services.controller");

// upload
serviceRouter.post(
  "/upload",
  check("id").not().isEmpty().withMessage("Error: Please enter a valid id"),
  check("images")
    .not()
    .isEmpty()
    .isArray()
    .custom((value) => {
      const base64regex =
        /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
      value.forEach((element) => {
        if (base64regex.test(element) == false) {
          throw "Error: images type";
        }
      });
      return true;
    })
    .withMessage("Error: Please enter a valid images"),
  upload
);
// upload/delete
serviceRouter.post(
  "/upload/delete",
  check("id").not().isEmpty().withMessage("please enter id"),
  deleteImg
);
// Get Services :
serviceRouter.post("/getservices", getServices);

module.exports = serviceRouter;
