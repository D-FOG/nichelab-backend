import { Router } from "express";
import { createContactMessageController } from "../controller/contact.controller.js";

const router = Router();

router.post("/contact", createContactMessageController);

export default router;