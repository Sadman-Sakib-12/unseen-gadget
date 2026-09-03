import { Router } from "express";
import * as cmsController from "../controllers/cms.controller";
import { optionalAdminAuth, authenticateAdmin } from "../middlewares/auth";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate";
import {
  idParamsSchema,
  cmsPostSchema,
  cmsPostUpdateSchema,
  promotionCreateSchema,
  promotionUpdateSchema,
  cmsJobSchema,
  cmsJobUpdateSchema,
  cmsPageUpdateSchema,
  cmsSettingValueSchema,
} from "../validations/ops.validations";

const router = Router();

// Populates req.adminUser when a valid admin cookie is present.
router.use(optionalAdminAuth);

// Blog posts
router.get("/posts", cmsController.listPosts);
router.get("/posts/:id", cmsController.getPost);
router.post("/posts", authenticateAdmin, validateBody(cmsPostSchema), cmsController.createPost);
router.put(
  "/posts/:id",
  authenticateAdmin,
  validateParams(idParamsSchema),
  validateBody(cmsPostUpdateSchema),
  cmsController.updatePost,
);
router.delete("/posts/:id", authenticateAdmin, validateParams(idParamsSchema), cmsController.deletePost);

// Promotions (CMS view of the Promotion model)
router.get("/promotions", cmsController.listPromotions);
router.get("/promotions/:id", cmsController.getPromotion);
router.post("/promotions", authenticateAdmin, validateBody(promotionCreateSchema), cmsController.createPromotion);
router.put(
  "/promotions/:id",
  authenticateAdmin,
  validateParams(idParamsSchema),
  validateBody(promotionUpdateSchema),
  cmsController.updatePromotion,
);
router.delete(
  "/promotions/:id",
  authenticateAdmin,
  validateParams(idParamsSchema),
  cmsController.deletePromotion,
);

// Jobs
router.get("/jobs", cmsController.listJobs);
router.get("/jobs/:id", cmsController.getJob);
router.post("/jobs", authenticateAdmin, validateBody(cmsJobSchema), cmsController.createJob);
router.put(
  "/jobs/:id",
  authenticateAdmin,
  validateParams(idParamsSchema),
  validateBody(cmsJobUpdateSchema),
  cmsController.updateJob,
);
router.delete("/jobs/:id", authenticateAdmin, validateParams(idParamsSchema), cmsController.deleteJob);

// Pages
router.get("/pages", cmsController.listPages);
router.get("/pages/:slug", cmsController.getPageBySlug);
router.put(
  "/pages/:slug",
  authenticateAdmin,
  validateBody(cmsPageUpdateSchema),
  cmsController.updatePage,
);

// Setting-backed CMS areas (public read, admin write)
for (const area of ["footer", "banners", "navbar", "about", "landing", "announcements", "general", "payment", "featured-categories", "top-categories", "stories", "brands", "shipping", "faq"] as const) {
  router.get(`/${area}`, cmsController.getCmsSetting(area));
  router.put(
    `/${area}`,
    authenticateAdmin,
    validateBody(cmsSettingValueSchema),
    cmsController.putCmsSetting(area),
  );
}

// Public notifications / announcements for customers
router.get("/notifications", cmsController.getCmsSetting("announcements"));

export default router;
