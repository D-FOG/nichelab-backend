import express from "express";
import { signupAdmin, signinAdmin, getMyProfile, createAdminController, fetchAllAdmins, fetchActiveAdmins, fetchAdminStats, updateAdminDetails, disableAdminAccount, changeAdminPassword} from "../controllers/admin.controller.js";
import { adminAuth } from "../../../middlewares/adminAuth.js";
import { superAdminOnly } from "../../../middlewares/superAdminAuth.js";

const router = express.Router();

router.post("/admin/signup", signupAdmin);
router.post("/admin/login", signinAdmin);

router.use(adminAuth);

// profile
router.get("/admins/me", getMyProfile);

// super admin only
router.post("/admins", superAdminOnly, createAdminController);
router.get("/admins", superAdminOnly, fetchAllAdmins);
router.get("/admins/active", superAdminOnly, fetchActiveAdmins);
router.get("/admins/stats", superAdminOnly, fetchAdminStats);
router.patch("/admins/:id", superAdminOnly, updateAdminDetails);
router.delete("/admins/:id", superAdminOnly, disableAdminAccount);
router.post("/admins/change-password", changeAdminPassword);
export default router;

// import { Router } from "express";
// import AdminController from "../controllers/admin.controller.js";
// import protect from "../../../middlewares/auth.js";

// const router = Router();

// router.post("/login", AdminController.login);
// router.get("/me", protect, (req, res) => {
//   res.json({ success: true, admin: req.admin });
// });

// export default router;
