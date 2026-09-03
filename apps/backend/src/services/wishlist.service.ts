import { prisma } from "@unseen-gadget/database";
import { NotFoundError } from "../utils/errors";

export async function getWishlist(userId: string) {
  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
  });

  return wishlist;
}

export async function addToWishlist(userId: string, productId: string) {
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  // Check if already in wishlist (@@unique constraint prevents duplicates at DB level)
  const existing = await prisma.wishlist.findFirst({
    where: { userId, productId },
  });

  if (existing) {
    return existing;
  }

  const wishlistItem = await prisma.wishlist.create({
    data: { userId, productId },
    include: { product: true },
  });

  return wishlistItem;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const existing = await prisma.wishlist.findFirst({
    where: { userId, productId },
  });

  if (!existing) {
    return null;
  }

  await prisma.wishlist.delete({
    where: { id: existing.id },
  });

  return { deleted: true };
}