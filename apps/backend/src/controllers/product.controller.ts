import type { Request, Response } from "express";
import type {
  ProductCreateInput,
  ProductQueryInput,
  ProductUpdateInput,
} from "@unseen-gadget/validations";
import * as productService from "../services/product.service";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { BadRequestError } from "../utils/errors";

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validated.query as unknown as ProductQueryInput;
  const result = await productService.listProducts(query);
  ApiResponseUtil.paginated(res, result.items, result.total, result.page, result.limit);
});

export const getProductDetail = asyncHandler(async (req: Request, res: Response) => {
  const data = await productService.getProductDetailBySlug(req.params.slug);
  ApiResponseUtil.success(res, data);
});

export const getNewArrivals = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 8, 100);
  const items = await productService.getNewArrivals(limit);
  ApiResponseUtil.success(res, items);
});

export const getTopSelling = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 8, 100);
  const items = await productService.getTopSelling(limit);
  ApiResponseUtil.success(res, items);
});

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await productService.getProductReviewsBySlug(req.params.slug);
  ApiResponseUtil.success(res, reviews);
});

export const listAdminProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validated.query as unknown as ProductQueryInput;
  const result = await productService.listAdminProducts(query);
  ApiResponseUtil.paginated(res, result.items, result.total, result.page, result.limit);
});

export const getAdminProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getAdminProductById(req.params.id);
  ApiResponseUtil.success(res, product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as ProductCreateInput;
  const product = await productService.createProduct(input);
  ApiResponseUtil.created(res, product, "Product created successfully");
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as unknown as ProductUpdateInput;
  const product = await productService.updateProduct(req.params.id, input);
  ApiResponseUtil.success(res, product, "Product updated successfully");
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) throw new BadRequestError("Product id is required");
  await productService.deleteProduct(req.params.id);
  ApiResponseUtil.noContent(res);
});

export const ProductController = {
  listProducts,
  getProductDetail,
  getNewArrivals,
  getTopSelling,
  getProductReviews,
  listAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default ProductController;