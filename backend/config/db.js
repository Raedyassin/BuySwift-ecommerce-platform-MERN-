import mongoose from "mongoose";

const connectDB = async () =>{
  try {
    await mongoose.connect(process.env.MONGO_RUL)
    console.log("Database is connected successfuly 📑")
  } catch(err) {
    console.log(err.message + " ❌")
    process.exit(1)
  }
}

export default connectDB;