import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import protect from "../../../middlewares/auth.js";

const router = Router();

router.post("/login", AdminController.login);
router.get("/me", protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

export default router;
