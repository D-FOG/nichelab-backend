import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./modules/Admin/models/admin.model.js"; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createSuperAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // 1️⃣ Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: "superadmin" });

    if (existingSuperAdmin) {
      console.log("❌ Super Admin already exists");
      process.exit(0);
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash("SuperAdmin123!", 12);

    // 3️⃣ Create super admin
    await Admin.create({
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@wamze.com",
      password: hashedPassword,
      role: "superadmin",
      isActive: true,
    });

    console.log("✅ Super Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error creating Super Admin:", err);
    process.exit(1);
  }
}

createSuperAdmin();
