import { Router } from "express";
import path from "path";
import multer from "multer";
import { promises as fs } from "fs"; // Use fs.promises
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";

const route = Router();

const uploadDir = "uploads/user";

// Check and create directory asynchronously
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir); // Check if exists
  } catch (err) {
    await fs.mkdir(uploadDir, { recursive: true }); // Create if not
  }
};

// Run directory check (top-level await requires Node 14.8+)
await ensureUploadDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${req.user.username}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, must be jpeg, png, or webp"), false);
  }
};

const upload = multer({
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB
  storage,
  fileFilter,
});

export const uploadSingleImage = upload.single("img");

// route.post("/", uploadSingleImage, async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ status: FAIL, message: "No file uploaded" });
//     }
//     const imageUrl = `/uploads/user/${req.file.filename}`;
//     res.status(200).json({ status: SUCCESS, data: { img: imageUrl } });
//   } catch (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ status: FAIL, message: err.message });
//     } else if (err) {
//       return res.status(400).json({ status: FAIL, message: err.message });
//     }
//     if (!req.file) {
//       return res.status(400).json({ status: FAIL, message: "No file uploaded" });
//     }
//     return res.status(200).json({ status: SUCCESS, data: { image: req.file.filename } });
//   }
// });

export default route;