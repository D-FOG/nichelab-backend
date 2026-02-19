import { Router } from "express";
import {
  getAllContactMessagesController,
  getContactMessageByIdController,
  deleteContactMessageController
} from "../controller/contact.controller.js";
import { superAdminOnly } from "../../../middlewares/superAdminAuth.js";

const router = Router();

router.get(
  "/admin/contact/messages",
  superAdminOnly,
  getAllContactMessagesController
);

router.get(
  "/admin/contact/messages/:id",
  superAdminOnly,
  getContactMessageByIdController
);

router.get(
  "/admin/contact/messages",
  superAdminOnly,
  getAllContactMessagesController
);

export default router;