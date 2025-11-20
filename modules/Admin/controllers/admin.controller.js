import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../../../utils/generateTokens.js";

class AdminController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });
      if (!admin) throw new Error("Invalid email or password");

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) throw new Error("Invalid email or password");

      const token = generateToken(admin._id);

      res.json({
        success: true,
        token,
        admin: { id: admin._id, email: admin.email }
      });
    } catch (err) {
      next(err);
    }
  }
}

export default AdminController;
