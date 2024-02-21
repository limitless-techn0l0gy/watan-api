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
  { genDiscount, genSerialNo, checkSerialNo, genPoints, getAppEarnings } = require("../functions/commerce"),
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
      var findServices = await model.find({ services, country, governorate }).populate({ path: "agent_id" });
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
        if (dbCustomers == undefined || dbCustomers == null) {
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
            earnValue = await getAppEarnings(),
            { taad, earnings } = genDiscount(ta, discount, earnValue),
            serialNo = await genSerialNo(),
            checkSerial = await checkSerialNo(serialNo);
          if (checkSerial) {
            var newCommerce = await commerceModel.create({
              service_id: id,
              user_id,
              employee_id,
              ta,
              discount: discount + earnValue,
              taad,
              earnings,
              serialNo,
            });
            if (newCommerce != null) {
              var commerce_id = newCommerce["id"],
                service_id = id,
                saleService,
                sales = [],
                saleBody = {
                  commerce_id,
                  service_id,
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
  uploadBill = async (req, res) => {
    var { serialNo, userID, imageUrl, imageName, startUpload, filePath, dirpath } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, {}, async () => {
      var exist = await userModel.findOne({ userID });
      if (exist == null) {
        body = {
          success: false,
          msg: lang.not_found,
        };
        code = 404;
      } else {
        if (startUpload) {
          body = { success: true, body: { serialNo, userID, imageUrl, imageName, startUpload, filePath, dirpath } };
          code = 200;
        } else {
          body = {
            success: false,
            msg: lang.image_type_error,
          };
          code = 400;
        }
      }
      token = genToken(body);
      res.status(code).json({ token });
    });
  },
  buy = async (req, res) => {
    var { serialNo, ammount, image } = req.body,
      lang = getLanguage(req.body.language),
      validateData = validationResult(req).array();
    auth(res, lang, validateData, { serialNo, ammount, image }, async () => {
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
                });
                commerce = [];
                dbCustomers = boughtServices["commerce"];
                var includedSerial = false,
                  haveImg = true;
                if (dbCustomers.length > 0) {
                  dbCustomers.forEach((value) => {
                    if (serialNo != value["serialNo"]) {
                      commerce.push(value);
                    } else {
                      if (value["billImage"]["imageUrl"] == undefined) {
                        haveImg = false;
                        includedSerial = true;
                      } else {
                        return includedSerial = true;
                      }
                    }
                  });
                }
                if (includedSerial == false || haveImg == false) {
                  var verify = false,
                    earnValue = await getAppEarnings(),
                    points = genPoints(findCommerce["earnings"], earnValue),
                    boughtBody;
                  if (image != undefined && image["startUpload"] == true) {
                    verify = true;
                    boughtBody = {
                      serialNo,
                      commerce_id: findCommerce["id"],
                      service_id: findCommerce["service_id"],
                      billImage: {
                        imageUrl: image["imageUrl"],
                        imageName: image["imageName"],
                        filePath: image["filePath"],
                        dirpath: image["dirpath"]
                      },
                      points,
                      verify,
                    };
                  } else {
                    verify = false;
                    boughtBody = {
                      serialNo,
                      commerce_id: findCommerce["id"],
                      service_id: findCommerce["service_id"],
                      points,
                      billImage: {},
                      verify,
                    };
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
                    msg: lang.ce
                  };
                  code = 400;
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
  uploadBill,
  buy,
};