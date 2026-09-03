import { Router } from "express";
import * as jobController from "../controllers/job.controller";

const router = Router();

router.get("/", jobController.listJobOpenings);
router.get("/:slug", jobController.getJobBySlug);
router.post("/:id/apply", jobController.applyForJob);

export default router;
