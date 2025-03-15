//////////////////package
import express from 'express'
import 'dotenv/config'
import path from 'path'
import cookieParser from 'cookie-parser'
// import cors from 'cors'


// routes
import userRoutes from "./routers/users.routes.js"
import categoryRoutes from './routers/category.routes.js'
import productRoutes from './routers/product.routes.js'
import uploadRoutes from './routers/upload.routes.js'
import orderRoutes from './routers/order.routes.js'
import paymentRoutes from './routers/payment.routes.js'

/////////////////////utils
import { ERROR, FAIL, SUCCESS } from './utils/httpStatucText.js'
import connectDB from './config/db.js'
import AppError from './utils/appError.js'
const PORT = process.env.PORT || 5222


connectDB();
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


app.use('/api/users', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/payment', paymentRoutes)


const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, 'uploads')))


app.all('*', (req, res) => {
  res.status(400).json({ status: FAIL, data: { tiltle: "Page Not found" } })
})




app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ status: err.statusText, message: err.message });
  }
  console.log(err)
  return res.status(500).json({ status: ERROR, message: "Internal server error" });
})



app.listen(PORT, () => {
  console.log('Server is running on port 5222 🚀')
})







