import { createAdmin, loginAdmin } from "../services/adminAuth.service.js";
import {
  createAdminBySuperAdmin,
  getAllAdmins,
  getActiveAdmins,
  getAdminStats,
  updateAdmin,
  disableAdmin,
  updateAdminPassword
} from "../services/admin.service.js";
//import { ApiResponse } from "../../utils/ApiResponse.js";

import { ApiResponse } from "../../../utils/ApiResponse.js";

export const signupAdmin = async (req, res, next) => {
  try {
    const admin = await createAdmin(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, "Admin created successfully", admin));
  } catch (err) {
    next(err);
  }
};

export const signinAdmin = async (req, res, next) => {
  try {
    const data = await loginAdmin(req.body);

    res
      .status(200)
      .json(new ApiResponse(200, "Login successful", data));
  } catch (err) {
    next(err);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    await sendResetPasswordLink(email);
    // respond generically
    res.json(new ApiResponse(200, "If that email exists, a reset link was sent."));
  } catch (err) {
    next(err);
  }
};

export const confirmPasswordReset = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordWithToken(token, newPassword);
    res.json(new ApiResponse(200, result.message));
  } catch (err) {
    next(err);
  }
};

export const getMyProfile = async (req, res) => {
  res.json(
    new ApiResponse(200, "Profile fetched", req.admin)
  );
};

export const createAdminController = async (req, res, next) => {
  try {
    const admin = await createAdminBySuperAdmin(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, "Admin created", admin));
  } catch (err) {
    next(err);
  }
};

export const fetchAllAdmins = async (req, res, next) => {
  try {
    const admins = await getAllAdmins();
    res.json(new ApiResponse(200, "Admins fetched", admins));
  } catch (err) {
    next(err);
  }
};

export const fetchActiveAdmins = async (req, res, next) => {
  try {
    const admins = await getActiveAdmins();
    res.json(new ApiResponse(200, "Active admins", admins));
  } catch (err) {
    next(err);
  }
};

export const fetchAdminStats = async (req, res, next) => {
  try {
    const stats = await getAdminStats();
    res.json(new ApiResponse(200, "Admin stats", stats));
  } catch (err) {
    next(err);
  }
};

export const updateAdminDetails = async (req, res, next) => {
  try {
    const admin = await updateAdmin(req.params.id, req.body);
    res.json(new ApiResponse(200, "Admin updated", admin));
  } catch (err) {
    next(err);
  }
};

export const disableAdminAccount = async (req, res, next) => {
  try {
    const admin = await disableAdmin(req.params.id);
    res.json(new ApiResponse(200, "Admin disabled", admin));
  } catch (err) {
    next(err);
  }
};

export const changeAdminPassword = async (req, res, next) => {
  try {
    const admin = await updateAdminPassword(req.admin._id, req.body);

    res.json(new ApiResponse(200, "Password changed successfully", admin));
  } catch (err) {
    next(err);
  }
};

// import Admin from "../models/admin.model.js";
// import bcrypt from "bcryptjs";
// import generateToken from "../../../utils/generateTokens.js";

// class AdminController {
//   static async login(req, res, next) {
//     try {
//       const { email, password } = req.body;

//       const admin = await Admin.findOne({ email });
//       console.log(admin);
//       if (!admin) {
//         const error = new Error("Admin not found");
//         error.statusCode = 401;
//         return next(error);
//       }

//       const isMatch = await bcrypt.compare(password, admin.password);
//       if (!isMatch) {
//         const error  = new Error("Invalid email or password");
//         error.statusCode = 401;
//         return next(error);
//       }

//       const token = generateToken(admin._id);

//       res.json({
//         success: true,
//         token,
//         admin: { id: admin._id, email: admin.email }
//       });
//     } catch (err) {
//       err.statusCode = 500;
//       next(err);
//     }
//   }
// }

// export default AdminController;
