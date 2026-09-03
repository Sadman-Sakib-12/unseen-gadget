import { Router } from "express";
import {
  productQuerySchema,
  productSlugParamsSchema,
} from "@unseen-gadget/validations";
import * as productController from "../controllers/product.controller";
import { validateParams, validateQuery } from "../middlewares/validate";

const router = Router();

router.get("/", validateQuery(productQuerySchema), productController.listProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/top-selling", productController.getTopSelling);
router.get(
  "/:slug/reviews",
  validateParams(productSlugParamsSchema),
  productController.getProductReviews,
);
router.get(
  "/:slug",
  validateParams(productSlugParamsSchema),
  productController.getProductDetail,
);

export default router;