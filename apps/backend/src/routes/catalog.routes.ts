import { Router } from "express";
import * as catalogController from "../controllers/catalog.controller";

const router = Router();

router.get("/categories", catalogController.getCategoryTree);
router.get("/brands", catalogController.listBrands);

export default router;