// import mongoose from "mongoose";

// export const fun = async () => {
//   const reviewSchema = new mongoose.Schema({
//     description: {
//       type: mongoose.Schema.Types.ObjectId, // Reference to User
//       required: true,
//       ref: "User"
//     },
//     name: {
//       type: String,
//       required: true
//     },
//     age: {
//       type: Number,
//       required: true
//     }

//   });

//   const ReviewModel = mongoose.model("Review", reviewSchema);

//   await ReviewModel.create({ description: "67a2cb86488d1b53426534af",name:"raed",age:20 });

//   const res = await ReviewModel.find().populate("description").exec();
//   console.log(res);
// };
