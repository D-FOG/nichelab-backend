import jwt from "jsonwebtoken";
import Admin from "../modules/Admin/models/admin.model.js";

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Not authorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) throw new Error("Admin not found");

    next();
  } catch (err) {
    next(err);
  }
};

export default protect;
