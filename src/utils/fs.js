const fs = require("fs"),
  createFolder = (path) => {
    fs.mkdir(path, (err) => {
      if (err) return false;
      return true;
    });
  },
  readFolder = (path) => {
    fs.readdir(path, (err, files) => {
      if (err) return [];
      return files;
    });
  },
  removeFolder = (path) => {
    fs.rmdir(path, (err) => {
      if (err) return false;
      return true;
    });
  },
  removeFile = (path) => {
    fs.unlink(path, (err) => {
      if (err) return false;
      return true;
    });
  };
module.exports = { createFolder, readFolder, removeFolder, removeFile };
