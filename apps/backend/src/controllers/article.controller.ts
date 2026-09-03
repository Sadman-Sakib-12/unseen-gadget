import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { NotFoundError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";

export const listArticles = asyncHandler(async (_req: Request, res: Response) => {
  const articles = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      author: true,
      featuredImage: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  ApiResponseUtil.success(res, articles);
});

export const getArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const article = await prisma.blogPost.findFirst({
    where: {
      OR: [{ id: slug }, { slug: slug }],
      status: "PUBLISHED",
    },
  });

  if (!article) {
    throw new NotFoundError("Article not found");
  }

  ApiResponseUtil.success(res, article);
});

export const ArticleController = {
  listArticles,
  getArticleBySlug,
};

export default ArticleController;
