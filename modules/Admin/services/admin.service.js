import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import crypto from "crypto";
import { Resend } from "resend";

let resendClient = null;
function getResendClient() {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  try {
    resendClient = new Resend(apiKey);
    return resendClient;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize Resend client:", err);
    return null;
  }
}

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
    throw err;
  }
};

export const sendResetPasswordLink = async (email) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    // don't reveal whether the email exists
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  admin.resetPasswordToken = token;
  admin.resetPasswordExpires = expires;
  await admin.save();

  const resetLink = `https://example.com/reset-password?token=${token}`; // dummy frontend link

  // send email via Resend (lazily initialize client)
  const client = getResendClient();
  if (!client) {
    // Resend not configured; log and return
    // eslint-disable-next-line no-console
    console.warn("Resend API key not configured; skipping reset email.");
    return;
  }

  try {
    await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "no-reply@example.com",
      to: email,
      subject: "Reset your admin password",
      html: `<p>You requested a password reset. Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you didn't request this, ignore this email.</p>`,
    });
  } catch (err) {
    // log and continue — don't expose internal errors to callers
    // eslint-disable-next-line no-console
    console.error("Failed to send reset email:", err);
  }
};

export const resetPasswordWithToken = async (token, newPassword) => {
  const admin = await Admin.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!admin) {
    throw new ApiError(400, "Invalid or expired token");
  }

  admin.password = await bcrypt.hash(newPassword, 12);
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpires = undefined;
  admin.mustChangePassword = false;

  await admin.save();

  return { message: "Password updated successfully" };
};
