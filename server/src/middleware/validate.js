import { validationResult } from "express-validator";
import { errorResponse } from "../utils/apiResponse.js";

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const formatted = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return errorResponse(res, 400, "Validation failed", formatted);
  }
  next();
};

export default validate;
