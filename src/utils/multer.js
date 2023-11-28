require("dotenv").config();
const multer = require("multer"),
  serviceModel = require("../model/services.model"),
  { createFolder } = require("./fs"),
  { hashString } = require("../functions/auth"),
  path = require("path"),
  storageImages = multer.diskStorage({
    destination: (req, file, cb) => {
      var { MC } = req.body,
        dirpath = __dirname + "/../storages/images/" + MC;
      createFolder(dirpath);
      req.body["dirpath"] = dirpath;
      cb(null, path.join(__dirname, "../storages/images/" + MC));
    },
    filename: async (req, file, cb) => {
      var { id, MC, dirpath } = req.body,
        name = file.originalname,
        filePath = dirpath + name,
        url = `${process.env.SERVER_URL}/image/${MC}/${name}`,
        findService = await serviceModel.findOne({ _id: id });
      req.body["filePath"] = await hashString(filePath);
      req.body["imageUrl"] = await hashString(url);
      req.body["imageName"] = await hashString(name);
      if (findService["images"].length <= 5) {
        req.body["startUpload"] = true;
        cb(null, name);
      } else {
        cb("failed upload", false);
        req.body["startUpload"] = false;
      }
    },
    allowedFiles: function (req, file, cb) {
      // Accept images only
      if (
        !file.originalname.match(
          /\.(pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/
        )
      ) {
        cb("failed upload", false);
      }
      cb(null, true);
    },
  }),
  storageBills = multer.diskStorage({
    destination: (req, file, cb) => {
      var { userID } = req.body,
        dirpath = __dirname + "/../storages/bills/" + userID;
      createFolder(dirpath);
      cb(null, path.join(__dirname, "../storages/bills/" + userID));
    },
    filename: (req, file, cb) => {
      var { userID } = req.body,
        name = file.originalname,
        url = `${process.env.SERVER_URL}/image/${userID}/${name}`;
      req.body["imageUrl"] = url;
      req.body["imageName"] = name;
      cb(null, name);
    },
  }),
  uploadImg = multer({ storage: storageImages, limits: { fileSize: "5mb" } }),
  uploadBills = multer({ storage: storageBills }).single("billImage");
module.exports = { uploadImg, uploadBills };
