import { Router } from "express";
import * as newsletterController from "../controllers/newsletter.controller";

const router = Router();

// POST /api/newsletter - Subscribe to newsletter
router.post("/", newsletterController.subscribeNewsletter);

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
router.post("/unsubscribe", newsletterController.unsubscribeNewsletter);

export default router;