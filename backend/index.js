//////////////////package
import express from 'express'
import 'dotenv/config'
import path from 'path'
import cookieParser from 'cookie-parser'
import multer from "multer";
import cors from 'cors'
// import cors from 'cors'

// routes
import userRoutes from "./routers/users.routes.js"
import categoryRoutes from './routers/category.routes.js'
import productRoutes from './routers/product.routes.js'
// import uploadRoutes from './routers/upload.routes.js'
// import uploadUserImgRoutes from './routers/uploadUser.routes.js'
import dashboardRoutes from './routers/dashboard.routes.js'

import orderRoutes from './routers/order.routes.js'
import paymentRoutes from './routers/paypalPayment.routes.js'

/////////////////////utils
import { ERROR, FAIL, SUCCESS } from './utils/httpStatucText.js'
import connectDB from './config/db.js'
import AppError from './utils/appError.js'
const PORT = process.env.PORT || 5222

connectDB();
const app = express()

// app.use(cors())
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl) or any origin
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use('/api/users', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/products', productRoutes)
// app.use('/api/upload', uploadRoutes)
// app.use('/api/upload/img', uploadUserImgRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/dashboard', dashboardRoutes)

const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, 'uploads')))

app.all('*', (req, res) => {
  res.status(400).json({ status: FAIL, message: "Page Not found" })
})

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ status: err.statusText, message: err.message });
  }
  // image error (by multer)
  else if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: FAIL,
        message: 'Image size should not exceed 10MB',
      });
    }
    return res.status(400).json({
      status: FAIL,
      message: err.message,
    });
  }
  return res.status(500).json({ status: ERROR, message: "Internal server error" });
})

app.listen(PORT, () => {
  console.log('Server is running on port 5222 🚀')
})







