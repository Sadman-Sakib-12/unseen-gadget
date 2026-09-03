import type { Request, Response } from "express";
import * as addressService from "../services/address.service";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await addressService.getAddresses(req.user!.id);
  ApiResponseUtil.success(res, addresses);
});

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as unknown as { isDefault?: boolean; name: string; phone: string; address: string; city: string; zipCode?: string };
  const isDefault = body.isDefault;
  const addressData = {
    name: body.name,
    phone: body.phone,
    address: body.address,
    city: body.city,
    zipCode: body.zipCode,
  };
  const address = await addressService.createAddress(req.user!.id, isDefault ?? false, addressData);
  ApiResponseUtil.success(res, address, "Address created");
});

export const getDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await addressService.getDefaultAddress(req.user!.id);
  ApiResponseUtil.success(res, address);
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const { addressId } = req.params;
  const body = req.validated.body as unknown as { isDefault?: boolean };
  const isDefault = body.isDefault;
  const address = await addressService.updateAddress(req.user!.id, addressId, isDefault ?? false);
  ApiResponseUtil.success(res, address, "Address updated");
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const { addressId } = req.params;
  const result = await addressService.deleteAddress(req.user!.id, addressId);
  ApiResponseUtil.success(res, result, "Address deleted");
});

export const AddressController = {
  getAddresses,
  createAddress,
  getDefaultAddress,
  updateAddress,
  deleteAddress,
};

export default AddressController;