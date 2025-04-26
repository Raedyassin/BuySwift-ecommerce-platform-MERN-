import path from "path";
import multer from "multer";
import fs from "fs";
export const uploadImageSettings = (isUser) => {
  // const uploadDir = "uploads/user";
  const uploadDir = isUser ? "uploads/user":"uploads/";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create if not exists
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const extname = path.extname(file.originalname);
      // `${req.user.username}-${Date.now()}${extname}` // for user
      // file.fieldname + "-" + Date.now() + extname // for product
      cb(null, `${isUser ? "user" : "product"}-${Date.now()}${extname}`);
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
  
  return upload.single("img");
}
