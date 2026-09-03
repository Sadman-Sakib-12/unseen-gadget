import { Router } from "express";
import * as articleController from "../controllers/article.controller";

const router = Router();

// GET /api/articles - List articles (only published)
router.get("/", articleController.listArticles);

// GET /api/articles/:slug - Get article by slug
router.get("/:slug", articleController.getArticleBySlug);

export default router;