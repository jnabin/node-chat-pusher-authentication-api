const util = require("util");
const path = require('path');
const multer = require("multer");
const maxSize = 25 * 1024 * 1024;
const genRand = (len) => {
    return Math.random().toString(36).substring(2,len+2);
  }

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    let fileName = `${genRand(10)}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;