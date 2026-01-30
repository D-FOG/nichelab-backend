import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "./admin.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const createAdmin = async (payload) => {
  const { firstName, lastName, email, password } = payload;

  const existing = await Admin.findOne({ email });
  if (existing) {
    throw new ApiError(400, "Admin already exists");
  }

  // Check if any superadmin already exists
  const superAdminExists = await Admin.exists({ role: "superadmin" });

  let role = "admin";

  // First ever admin becomes superadmin
  if (!superAdminExists) {
    role = "superadmin";
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  return admin;
};


export const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!admin.isActive) {
    throw new ApiError(403, "Admin account disabled");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  admin.lastSeen = new Date();
  await admin.save();

  return { admin, token };
};
