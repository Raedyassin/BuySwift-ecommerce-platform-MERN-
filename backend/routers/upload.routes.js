import { Router } from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";

const route = Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + extname);
  }
});

const fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, must be jpeg, png, or webp"), false);
  }
};

const upload = multer({
  limits: { fileSize: 1024 * 1024 * 10 },
  storage,
  fileFilter
});

const uploadSingleImage = upload.single("img");

route.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ status: FAIL, message: err.message });
    } else if (err) {
      return res.status(400).json({ status: FAIL, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ status: FAIL, message: "No file uploaded" });
    }
    return res.status(200).json({ status: SUCCESS, data: { image: req.file.path } });
  });
});

export default route;
