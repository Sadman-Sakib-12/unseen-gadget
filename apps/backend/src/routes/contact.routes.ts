import { Router } from "express";
import * as contactController from "../controllers/contact.controller";
import { authenticateAdmin } from "../middlewares/auth";

const router = Router();

router.post("/", contactController.createContactMessage);
router.get("/", authenticateAdmin, contactController.getContactMessages);

export default router;
