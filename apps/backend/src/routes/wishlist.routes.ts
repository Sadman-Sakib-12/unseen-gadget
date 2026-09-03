import { Router } from "express";
import * as wishlistController from "../controllers/wishlist.controller";
import { authenticateCustomer } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { wishlistToggleSchema } from "@unseen-gadget/validations";

const router = Router();

router.get(
  "/",
  authenticateCustomer,
  wishlistController.getWishlist,
);

router.post(
  "/",
  authenticateCustomer,
  validateBody(wishlistToggleSchema),
  wishlistController.addToWishlist,
);

router.delete(
  "/:productId",
  authenticateCustomer,
  wishlistController.removeFromWishlist,
);

export default router;