import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./modules/Admin/models/admin.model.js"; // update path if needed
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const hashed = await bcrypt.hash("Admin123!", 10);

    await Admin.create({
      email: "admin@wamze.com",
      password: hashed,
      role: "admin",
    });

    console.log("Admin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

createAdmin();
