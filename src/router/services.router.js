const serviceRouter = require("express").Router(),
  check = require("express-validator").check,
  { uploadImg, uploadBills } = require("../utils/multer"),
  {
    uploadImages,
    getImages,
    addImages,
    deleteImages,
    getServices,
    sale,
    uploadBill,
    buy,
  } = require("../controller/services.controller"),
  imagesPath = "/images";
// /images/upload :
serviceRouter.post(
  imagesPath + "/upload",
  uploadImg.single("image"),
  check("id").not().isEmpty().isString(),
  check("MC").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  uploadImages
);
// /images/get :
serviceRouter.post(
  imagesPath + "/get",
  check("id").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  getImages
);
// /images/add :
serviceRouter.post(
  imagesPath + "/add",
  check("id").not().isEmpty().isString(),
  check("logo").not().isEmpty().isObject(),
  check("images").not().isEmpty().isArray(),
  check("language").not().isEmpty().isString(),
  addImages
);
// /images/delete :
serviceRouter.post(
  imagesPath + "/delete",
  check("id").not().isEmpty().isString(),
  check("images").not().isEmpty().isArray(),
  check("language").not().isEmpty().isString(),
  deleteImages
);
// Get Services :
serviceRouter.post(
  "/get",
  check("services").not().isEmpty().isString(),
  check("country").not().isEmpty().isString(),
  check("governorate").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  getServices
);
// Sale :
serviceRouter.post(
  "/sale",
  check("id").not().isEmpty().isString(),
  check("userID").not().isEmpty().isString(),
  check("employee_id").not().isEmpty().isString(),
  check("ta").not().isEmpty().isInt(),
  check("language").not().isEmpty().isString(),
  sale
);
// Upload bill :
serviceRouter.post(
  imagesPath + "/bill/upload",
  uploadBills.single("image"),
  check("serialNo").not().isEmpty().isString(),
  check("userID").not().isEmpty().isString(),
  check("language").not().isEmpty().isString(),
  uploadBill,
);
// buy :
serviceRouter.post(
  "/buy",
  check("serialNo").not().isEmpty().isString(),
  check("ammount").not().isEmpty().isInt(),
  check("language").not().isEmpty().isString(),
  buy
);
module.exports = serviceRouter;
