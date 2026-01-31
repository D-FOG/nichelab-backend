import { ApiError } from "../utils/ApiError.js";
export const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== "superadmin") {
    throw new ApiError(403, "Access denied: Super Admins only");
  }
  next();
};
