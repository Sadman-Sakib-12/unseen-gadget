import { Router } from "express";
import {
  brandCreateSchema,
  brandIdParamsSchema,
  brandUpdateSchema,
  categoryCreateSchema,
  categoryIdParamsSchema,
  categoryUpdateSchema,
  productCreateSchema,
  productIdParamsSchema,
  productQuerySchema,
  productUpdateSchema,
} from "@unseen-gadget/validations";
import * as catalogController from "../controllers/catalog.controller";
import * as productController from "../controllers/product.controller";
import * as uploadController from "../controllers/upload.controller";
import * as orderController from "../controllers/order.controller";
import { AdminCustomerController } from "../controllers/admin-customer.controller";
import { AdminCouponController } from "../controllers/admin-coupon.controller";
import { authenticateAdmin } from "../middlewares/auth";
import { requirePermission } from "../middlewares/authorize";
import { uploadImageMiddleware } from "../middlewares/upload";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate";

const router = Router();

router.use(authenticateAdmin);

router.get("/categories", catalogController.listCategories);
router.get("/brands", catalogController.listBrands);

router.get("/orders", requirePermission("view_orders"), orderController.listAdminOrders);
router.post("/orders", requirePermission("manage_orders"), orderController.createAdminOrder);
router.get("/orders/:orderId", requirePermission("view_orders"), orderController.getAdminOrder);
router.put("/orders/:orderId/status", requirePermission("manage_orders"), orderController.updateAdminOrderStatus);
router.patch("/orders/:orderId/status", requirePermission("manage_orders"), orderController.updateAdminOrderStatus);
router.put("/orders/:orderId", requirePermission("manage_orders"), orderController.updateAdminOrderStatus);
router.patch("/orders/:orderId", requirePermission("manage_orders"), orderController.updateAdminOrderStatus);
router.delete("/orders/:orderId", requirePermission("manage_orders"), orderController.deleteAdminOrder);

router.post(
  "/categories",
  requirePermission("manage_products"),
  validateBody(categoryCreateSchema),
  catalogController.createCategory,
);
router.put(
  "/categories/:id",
  requirePermission("manage_products"),
  validateParams(categoryIdParamsSchema),
  validateBody(categoryUpdateSchema),
  catalogController.updateCategory,
);
router.delete(
  "/categories/:id",
  requirePermission("manage_products"),
  validateParams(categoryIdParamsSchema),
  catalogController.deleteCategory,
);

router.post(
  "/brands",
  requirePermission("manage_products"),
  validateBody(brandCreateSchema),
  catalogController.createBrand,
);
router.put(
  "/brands/:id",
  requirePermission("manage_products"),
  validateParams(brandIdParamsSchema),
  validateBody(brandUpdateSchema),
  catalogController.updateBrand,
);
router.delete(
  "/brands/:id",
  requirePermission("manage_products"),
  validateParams(brandIdParamsSchema),
  catalogController.deleteBrand,
);

router.get("/products", validateQuery(productQuerySchema), productController.listAdminProducts);
router.get(
  "/products/:id",
  validateParams(productIdParamsSchema),
  productController.getAdminProduct,
);
router.post(
  "/products",
  requirePermission("manage_products"),
  validateBody(productCreateSchema),
  productController.createProduct,
);
router.put(
  "/products/:id",
  requirePermission("manage_products"),
  validateParams(productIdParamsSchema),
  validateBody(productUpdateSchema),
  productController.updateProduct,
);
router.delete(
  "/products/:id",
  requirePermission("manage_products"),
  validateParams(productIdParamsSchema),
  productController.deleteProduct,
);

router.post(
  "/upload",
  requirePermission("manage_products"),
  uploadImageMiddleware.single("file"),
  uploadController.uploadImage,
);

router.get("/customers", AdminCustomerController.listCustomers);
router.get("/customers/:customerId", AdminCustomerController.getCustomer);

router.get("/coupons", AdminCouponController.listCoupons);
router.post("/coupons", AdminCouponController.createCoupon);
router.put("/coupons/:couponId", AdminCouponController.updateCoupon);
router.delete("/coupons/:couponId", AdminCouponController.deleteCoupon);

export default router;