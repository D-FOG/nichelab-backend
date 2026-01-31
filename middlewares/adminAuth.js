import jwt from "jsonwebtoken";
import Admin from "../modules/Admin/models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new ApiError(401, "No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      throw new ApiError(401, "Unauthorized");
    }

    admin.lastSeen = new Date();
    await admin.save();

    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};

// import jwt from "jsonwebtoken";
// import Admin from "../modules/Admin/models/admin.model.js";

// const protect = async (req, res, next) => {
//   try {
//     let token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       const error = new Error("Not authorized, no token");
//       error.statusCode = 401;
//       throw error;
//     } 

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = await Admin.findById(decoded.id).select("-password");

//     if (!req.admin){ 
//       const error = new Error("Admin not found");
//       error.statusCode = 401;
//       throw error;
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// export default protect;
