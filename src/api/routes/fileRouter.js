const { Router } = require("express");
const fileController = require("../controllers/file");
const fileRouter = Router();
const multer = require("multer");
const { BadRequest } = require("../utils/error");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/patient-form-uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const allowedMimeTypes = ["image/png", "image/jpeg", "application/pdf"];

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new BadRequest("Wrong file type"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

fileRouter.post(
  "/upload",
  upload.single("patient-registration-form"),
  fileController.upload
);

module.exports = fileRouter;
