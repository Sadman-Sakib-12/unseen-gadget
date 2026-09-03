import type { Request, Response } from "express";
import type {
  BrandCreateInput,
  BrandUpdateInput,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@unseen-gadget/validations";
import * as categoryService from "../services/category.service";
import * as brandService from "../services/brand.service";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const getCategoryTree = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.listCategoryTree();
  ApiResponseUtil.success(res, categories);
});

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.listCategories();
  ApiResponseUtil.success(res, categories);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as CategoryCreateInput;
  const category = await categoryService.createCategory(input);
  ApiResponseUtil.created(res, category, "Category created successfully");
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as CategoryUpdateInput;
  const category = await categoryService.updateCategory(req.params.id, input);
  ApiResponseUtil.success(res, category, "Category updated successfully");
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  ApiResponseUtil.noContent(res);
});

export const listBrands = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await brandService.listBrands();
  ApiResponseUtil.success(res, brands);
});

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as BrandCreateInput;
  const brand = await brandService.createBrand(input);
  ApiResponseUtil.created(res, brand, "Brand created successfully");
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as BrandUpdateInput;
  const brand = await brandService.updateBrand(req.params.id, input);
  ApiResponseUtil.success(res, brand, "Brand updated successfully");
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  await brandService.deleteBrand(req.params.id);
  ApiResponseUtil.noContent(res);
});

export const CatalogController = {
  getCategoryTree,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};

export default CatalogController;