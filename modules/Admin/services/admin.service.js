import bcrypt from "bcryptjs";
import Admin from "./admin.model.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * Super Admin creates a new admin
 * Role defaults to "admin"
 */
export const createAdminBySuperAdmin = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const exists = await Admin.findOne({ email });
  if (exists) {
    throw new ApiError(400, "Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "admin",
    mustChangePassword: true,
  });

  return admin;
};

/**
 * Fetch all admins
 */
export const getAllAdmins = async () => {
  return Admin.find().select("-password");
};

/**
 * Fetch active admins (last seen within 5 minutes)
 */
export const getActiveAdmins = async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  return Admin.find({
    lastSeen: { $gte: fiveMinutesAgo },
    isActive: true,
  }).select("-password");
};

/**
 * Admin stats
 */
export const getAdminStats = async () => {
  const totalAdmins = await Admin.countDocuments({ role: "admin" });
  const totalSuperAdmins = await Admin.countDocuments({
    role: "superadmin",
  });

  return { totalAdmins, totalSuperAdmins };
};

/**
 * Update role / permissions / status
 */
export const updateAdmin = async (adminId, payload) => {
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const { role, permissions, isActive } = payload;

  if (role) admin.role = role;
  if (permissions) admin.permissions = permissions;
  if (typeof isActive === "boolean") admin.isActive = isActive;

  await admin.save();
  return admin;
};

/**
 * Disable admin (soft delete)
 */
export const disableAdmin = async (adminId) => {
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  admin.isActive = false;
  await admin.save();

  return admin;
};

export const updateAdminPassword = async (adminId, currentPassword, newPassword) => {
  try {
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "All fields are required");
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    // 1️⃣ Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      throw new ApiError(400, "Current password is incorrect");
    }

    // 2️⃣ Hash new password
    admin.password = await bcrypt.hash(newPassword, 12);
    admin.mustChangePassword = false;

    await admin.save();

    return {
        message: "Password updated successfully"
    }
  } catch (err) {
    next(
    err);
  }
};
