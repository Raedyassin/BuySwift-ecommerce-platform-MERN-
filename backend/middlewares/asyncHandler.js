import AppError from "../utils/appError.js"
import { ERROR } from '../utils/httpStatucText.js'
const asyncHandler = (fun) => (req,res,next)=> {
  Promise.resolve(fun(req, res, next)).catch((err) => {
    if (err instanceof AppError) return next(err);
      next(new AppError(err.status || 500, ERROR, err.message));
    })
}

export default asyncHandler;