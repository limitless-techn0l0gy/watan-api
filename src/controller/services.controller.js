var { code, token, body } = require("../functions/auth");
const serviceModel = require("../model/services.model"),
  model = serviceModel,
  employeesModel = require("../model/employees.model"),
  MCModel = require("../model/membershipcodes.model"),
  userModel = require("../model/users.model"),
  commerceModel = require("../model/commerce.model"),
  validationResult = require("express-validator").validationResult,
  { genToken } = require("../config/jwt"),
  getLanguage = require("../localization/language"),
  { auth } = require("../functions/auth"),
  isbase64 = require("is-base64"),
  { genDiscount, genSerialNo, genPoints } = require("../functions/commerce"),
  { removeFolder, removeFile } = require("../utils/fs"),
  uploadImages = async (req, res) => {
    var { MC, imageUrl, imageName, startUpload, filePath, dirpath } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(
      req,
      lang,
      validateData,
      { MC, imageUrl, imageName, startUpload, filePath, dirpath },
      async () => {
        var existMC = await MCModel.findOne({ MC });
        if (existMC != null) {
          if (startUpload) {
            body = {
              success: true,
              body: {
                imageName,
                imageUrl,
                filePath,
                dirpath,
              },
            };
            code = 200;
          } else {
            removeFile(filePath);
            body = {
              success: false,
              msg: lang.unknown_error,
            };
            code = 500;
          }
        } else {
          body = {
            success: false,
            msg: lang.not_found,
          };
          code = 404;
        }
        token = genToken(body);
        res.status(code).json({ token });
      }
    );
  },
  /*
    {
      "id": "6558c0eb61b6d672eee6e3c1",
      "language": "ar"
    }
  */
  getImages = async (req, res) => {
    var { id } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { id }, async () => {
      var getImages = await model.findById({ _id: id });
      if (getImages != null) {
        body = {
          success: true,
          images: getImages["images"],
        };
        code = 200;
      } else {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  /*
    {
      "id": "654ce448fc13ae36ce2f9aca",
      "images": [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
      ],
      "language": "ar"
    }
  */
  addImages = async (req, res) => {
    var { id, logo, images } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { id, logo, images }, async () => {
      var dbImages = [],
        startAdd = false,
        existService = await model.findById({ _id: id });
      if (existService != null) {
        if (existService["images"].length > 0) {
          existService["images"].forEach((image) => {
            dbImages.push(image);
          });
        }
        if (dbImages.length < 5) {
          images.forEach((newImage) => {
            if (dbImages.includes(newImage) == false && dbImages.length < 5) {
              dbImages.push(newImage);
            }
          });
          startAdd = true;
        }
        if (startAdd) {
          var addImages = await model.findByIdAndUpdate(
            { _id: id },
            {
              images: dbImages,
              logo,
            },
            { new: true }
          );
          if (addImages != null) {
            body = { success: true, msg: lang.updated };
            code = 200;
          } else {
            body = {
              success: false,
              msg: lang.ce,
            };
            code = 500;
          }
        } else {
          body = {
            success: false,
            msg: lang.images_maximum,
          };
          code = 200;
        }
      } else {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  deleteImages = async (req, res) => {
    var { id, images } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { id, images }, async () => {
      var dbImages = [],
        startDelete = false,
        existService = await model.findById({ _id: id });
      if (existService != null) {
        if (existService["images"].length > 0) {
          existService["images"].forEach((image) => {
            if (images.includes(image) == false) {
              dbImages.push(image);
            } else {
              removeFile(image["filePath"]);
            }
          });
        }
        if (dbImages.length < 5) {
          startDelete = true;
        }
        if (startDelete) {
          var addImages = await model.findByIdAndUpdate(
            { _id: id },
            {
              images: dbImages,
            },
            { new: true }
          );
          if (addImages != null) {
            body = { success: true, msg: lang.deleted };
            code = 200;
          } else {
            body = {
              success: false,
              msg: lang.ce,
            };
            code = 500;
          }
        } else {
          body = {
            success: false,
            msg: lang.images_maximum,
          };
          code = 200;
        }
      } else {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  getServices = async (req, res) => {
    var { services, country, governorate } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { services, country, governorate }, async () => {
      var findServices = await model.find({ services }).populate({agent_id});
      if (findServices != null && findServices.length > 0) {
        body = {
          success: true,
          data: findServices,
        };
        code = 200;
      } else {
        body = {
          success: false,
          msg: lang.empty_services,
        };
        code = 404;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  sale = async (req, res) => {
    var { id, userID, employee_id, ta } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { id, userID, employee_id, ta }, async () => {
      var existService = await model.findOne({ _id: id });
      if (existService != null) {
        var findUser = await userModel.findOne({ userID }),
          existEmployee = await employeesModel.findOne({
            _id: employee_id,
          }),
          dbCustomers = parseInt(existService["customers"]),
          customers;
        if (dbCustomers == undefined) {
          customers = 1;
        } else {
          customers = dbCustomers + 1;
        }
        if (
          findUser != null &&
          existEmployee != null &&
          existService["availableEmployees"].includes(existEmployee["id"])
        ) {
          var user_id = findUser["id"],
            discount = existService["discount"],
            earn = existService["earn"],
            { taad, earnings } = genDiscount(ta, discount, earn),
            serialNo = await genSerialNo(existService["businessName"]);
          if (checkSerial) {
            var newCommerce = await commerceModel.create({
              service_id: id,
              user_id,
              employee_id,
              ta,
              discount,
              earn,
              taad,
              earnings,
              serialNo,
            });
            if (newCommerce != null) {
              var commerce_id = newCommerce["id"],
                saleService,
                sales = [],
                saleBody = {
                  commerce_id,
                  earnings,
                  verify: false,
                };
              if (existService["commerce"].length > 0) {
                existService["commerce"].forEach((value) => {
                  sales.push(value);
                });
              }
              sales.push(saleBody);
              saleService = await model.findOneAndUpdate(
                { _id: id },
                {
                  customers,
                  commerce: sales,
                },
                { new: true }
              );
              if (saleService != null) {
                body = { success: true, serialNo, msg: lang.saleMsg };
                code = 200;
              } else {
                body = {
                  success: false,
                  msg: lang.ce,
                };
                code = 500;
              }
            } else {
              body = {
                success: false,
                msg: lang.ce,
              };
              code = 500;
            }
          } else {
            body = {
              success: false,
              msg: lang.tryagain,
            };
            code = 200;
          }
        } else {
          body = {
            success: false,
            msg: lang.ce,
          };
          code = 500;
        }
      } else {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  /*
    {
      "serialNo": "Aquarius_38391",
      "ta": 720000,
      "language": "ar"
    }
  */
  buy = async (req, res) => {
    var { serialNo, ammount, image } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { serialNo, ammount, image }, async () => {
      var isImage = false,
        failure = false;
      if ((image != "", isbase64(image, { allowMime: true }))) {
        isImage = true;
      } else if (image != "") {
        failure = true;
      }
      if (failure == false) {
        var findCommerce = await commerceModel.findOne({ serialNo });
        if (findCommerce == null) {
          body = {
            success: false,
            msg: lang.not_found,
          };
          code = 404;
        } else {
          var ta = findCommerce["ta"];
          if (ta == ammount) {
            var commerce = [],
              verifyNow = {};
            verifiedSold = await serviceModel.findOne({
              _id: findCommerce["service_id"],
            });
            if (verifiedSold != null) {
              var dbCustomers = verifiedSold["commerce"];
              if (dbCustomers.length > 0) {
                dbCustomers.forEach((value) => {
                  if (value["commerce_id"] == findCommerce["id"]) {
                    verifyNow = value;
                    verifyNow["verify"] = true;
                    commerce.push(verifyNow);
                  } else {
                    commerce.push(value);
                  }
                });
                soldService = await serviceModel.findByIdAndUpdate(
                  {
                    _id: verifiedSold["id"],
                  },
                  {
                    commerce,
                  },
                  { new: true }
                );
                if (soldService != null) {
                  var boughtServices = await userModel.findOne({
                      _id: findCommerce["user_id"],
                    }),
                    verify = false,
                    points = genPoints(findCommerce["earnings"]);
                  commerce = [];
                  dbCustomers = boughtServices["commerce"];
                  if (dbCustomers.length > 0) {
                    dbCustomers.forEach((value) => {
                      commerce.push(value);
                    });
                  }
                  var boughtBody = {
                    commerce_id: findCommerce["id"],
                    billImage: "",
                    points,
                    verify,
                  };
                  if (isImage) {
                    boughtBody["billImage"] = image;
                    boughtBody["verify"] = true;
                  }
                  commerce.push(boughtBody);
                  boughtServices = await userModel.findByIdAndUpdate(
                    { _id: findCommerce["user_id"] },
                    { commerce },
                    { new: true }
                  );
                  if (boughtServices != null) {
                    body = {
                      success: true,
                      msg: lang.updated,
                    };
                    code = 200;
                  } else {
                    body = {
                      success: false,
                      msg: lang.unknown_error,
                    };
                    code = 500;
                  }
                } else {
                  body = {
                    success: false,
                    msg: lang.unknown_error,
                  };
                  code = 500;
                }
              } else {
                body = {
                  success: false,
                  msg: lang.unknown_error,
                };
                code = 500;
              }
            } else {
              body = {
                success: false,
                msg: lang.unknown_error,
              };
              code = 500;
            }
          } else {
            body = {
              success: false,
              msg: lang.bill_amount_error,
            };
            code = 500;
          }
        }
      } else {
        body = {
          success: false,
          msg: lang.image_type_error,
        };
        code = 500;
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  };
module.exports = {
  uploadImages,
  getImages,
  addImages,
  deleteImages,
  getServices,
  sale,
  buy,
};
