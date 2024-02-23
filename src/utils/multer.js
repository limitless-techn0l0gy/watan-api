require("dotenv").config();
const multer = require("multer"),
  serviceModel = require("../model/services.model"),
  userModel = require("../model/users.model"),
  { createFolder } = require("./fs"),
  path = require("path"),
  storageImages = multer.diskStorage({
    destination: (req, file, cb) => {
      var { MC } = req.body,
        dirpath = __dirname + "/../storages/images/" + MC,
        hashdirpath = btoa(dirpath);
      createFolder(dirpath);
      req.body["dirpath"] = hashdirpath;
      cb(null, path.join(__dirname, "/../storages/images/" + MC));
    },
    filename: async (req, file, cb) => {
      var { id, MC, dirpath } = req.body,
        name = file.originalname + "_" + MC,
        comparedDirPath = __dirname + "/../storages/images/" + MC,
        filePath = comparedDirPath + name,
        url = `${process.env.SERVER_URL}/image/${MC}/${name}`,
        findService = await serviceModel.findOne({ _id: id });
      req.body["filePath"] = btoa(filePath);
      req.body["imageUrl"] = url;
      req.body["imageName"] = name;
      req.body["dirpath"] = dirpath;
      if (findService["images"].length <= 5) {
        req.body["startUpload"] = true;
        cb(null, name);
      } else {
        req.body["startUpload"] = false;
        cb("failed upload", false);
      }
    },
  }),
  storageBills = multer.diskStorage({
    destination: (req, file, cb) => {
      var { userID } = req.body,
        dirpath = __dirname + "/../storages/bills/" + userID,
        hashdirpath = btoa(dirpath);
      createFolder(dirpath);
      req.body["dirpath"] = hashdirpath;
      cb(null, path.join(__dirname, "../storages/bills/" + userID));
    },
    filename: async (req, file, cb) => {
      var { userID, serialNo } = req.body,
        name = serialNo + "_" + file.originalname,
        comparedDirPath = __dirname + "/../storages/images/" + userID,
        filePath = comparedDirPath + name,
        url = `${process.env.SERVER_URL}/image/${userID}/${name}`,
        existUser = await userModel.findOne({ userID });
      req.body["filePath"] = btoa(filePath);
      req.body["imageUrl"] = url;
      req.body["imageName"] = name;
      if (existUser != null) {
        req.body["startUpload"] = true;
        cb(null, name);
      } else {
        req.body["startUpload"] = false;
        cb("failed upload", false);
      }
    },
  }),
  checkFileType = (req, file, cb) => {
    console.log(file.originalname);
    const allowedExtensions = /jpeg|jpg|png|gif|octet-stream/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);
    if (mimetype && extname) {
      req.body["startUpload"] = true;
      return cb(null, true);
    } else {
      req.body["startUpload"] = false;
      return cb(null, false);
    }
  },
  uploadImg = multer({
    storage: storageImages, limits: { fileSize: "5mb" },
    fileFilter: (req, file, cb) => {
      checkFileType(req, file, cb);
    }
  }),
  uploadBills = multer({
    storage: storageBills, limits: { fileSize: "5mb" }, fileFilter: (req, file, cb) => {
      checkFileType(req, file, cb);
    }
  });
module.exports = { uploadImg, uploadBills };



