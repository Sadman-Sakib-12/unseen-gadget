import type { Request, Response } from "express";
import * as uploadService from "../services/upload.service";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { BadRequestError } from "../utils/errors";

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new BadRequestError("No file uploaded");
  const result = await uploadService.uploadImage(req.file.buffer, req.file.originalname);
  ApiResponseUtil.created(res, result, "Image uploaded successfully");
});

export const UploadController = { uploadImage };

export default UploadController;