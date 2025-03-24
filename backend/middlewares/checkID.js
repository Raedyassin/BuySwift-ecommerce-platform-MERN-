import { isValidObjectId } from "mongoose";
import { FAIL } from "../utils/httpStatucText.js";

function checkID(req, res, next) {
  const { id, reviewId } = req.params;  
  if (!isValidObjectId(id)) {
    return res.status(400).json({ status: FAIL, message: "Invalid Id" });
  }
  if (reviewId && !isValidObjectId(reviewId)){
    return res.status(400).json({ status: FAIL, message: "Invalid reviewId " });
  }
  
  next(); 
}

export default checkID