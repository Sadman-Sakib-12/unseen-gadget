import { Router } from "express";
import * as addressController from "../controllers/address.controller";
import { authenticateCustomer } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { addressSchema } from "@unseen-gadget/validations";

const router = Router();

router.get(
  "/",
  authenticateCustomer,
  addressController.getAddresses,
);

router.post(
  "/",
  authenticateCustomer,
  validateBody(addressSchema),
  addressController.createAddress,
);

router.get(
  "/default",
  authenticateCustomer,
  addressController.getDefaultAddress,
);

router.put(
  "/:addressId",
  authenticateCustomer,
  addressController.updateAddress,
);

router.delete(
  "/:addressId",
  authenticateCustomer,
  addressController.deleteAddress,
);

export default router;