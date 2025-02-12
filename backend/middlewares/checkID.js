import { isValidObjectId } from "mongoose";
import { FAIL } from "../utils/httpStatucText.js";

function checkID(req, res, next) {
  const { id } = req.params;  
  if (!isValidObjectId(id)) {
    return res.status(400).json({ status: FAIL, message: "Invalid ID" });
  }    
  next(); 
}

export default checkID