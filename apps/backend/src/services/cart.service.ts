import { prisma } from "@unseen-gadget/database";
import type { Prisma } from "@prisma/client";
import type { AddToCartInput } from "@unseen-gadget/validations";
import { ConflictError, NotFoundError, BadRequestError } from "../utils/errors";

const CART_INCLUDE = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discount: true,
          images: true,
          inStock: true,
          status: true,
          stock: true,
          shippingType: true,
          shippingCost: true,
        },
      },
      variant: {
        select: {
          id: true,
          name: true,
          price: true,
          sku: true,
        },
      },
    },
  },
} as const;

type CartWithItems = Prisma.CartGetPayload<{
  include: typeof CART_INCLUDE;
}>;

interface CartItemDto {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  productName: string;
  productSlug: string;
  variantName?: string;
  image?: string;
  inStock: boolean;
  stock?: number;
  shippingType: "FREE" | "PAID";
  shippingCost: number;
}

interface CartDto {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItemDto[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  total: number;
}

interface CartItemFromDb {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount: number;
    images: string[];
    inStock: boolean;
    status: string;
    stock: number;
    shippingType: "FREE" | "PAID";
    shippingCost: number;
  };
  variant?: {
    id: string;
    name: string;
    price: number | null;
    sku?: string | null;
  } | null;
}

function toCartItemDto(item: CartItemFromDb): CartItemDto {
  const price = item.variant?.price ?? item.product.price;

  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId ?? undefined,
    quantity: item.quantity,
    price,
    productName: item.product.name,
    productSlug: item.product.slug,
    variantName: item.variant?.name,
    image: item.product.images[0],
    inStock: item.product.inStock,
    stock: item.product.stock,
    shippingType: item.product.shippingType,
    shippingCost: item.product.shippingCost,
  };
}

function toCartDto(cart: CartWithItems): CartDto {
  const items = cart.items.map(toCartItemDto);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Authoritative shipping calculation:
  // - Free shipping product -> 0
  // - Paid shipping product -> product.shippingCost
  // - Multiple quantities of the same product -> charged ONCE
  // - Multiple unique paid products -> sum of each unique product's shippingCost
  const uniqueProductShippingMap = new Map<string, number>();
  for (const item of cart.items) {
    if (item.product.shippingType === "PAID" && item.product.shippingCost > 0) {
      uniqueProductShippingMap.set(item.productId, item.product.shippingCost);
    }
  }
  const shippingCost = Array.from(uniqueProductShippingMap.values()).reduce((sum, cost) => sum + cost, 0);
  const total = subtotal + shippingCost;

  return {
    id: cart.id,
    userId: cart.userId ?? undefined,
    sessionId: cart.sessionId ?? undefined,
    items,
    totalItems,
    subtotal,
    shippingCost,
    total,
  };
}

export async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) {
    throw new BadRequestError("Either userId or sessionId is required");
  }

  let cart = await prisma.cart.findFirst({
    where: {
      ...(userId ? { userId } : {}),
      ...(sessionId ? { sessionId } : {}),
    },
    include: CART_INCLUDE,
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        ...(userId ? { user: { connect: { id: userId } } } : {}),
        ...(sessionId ? { sessionId } : {}),
      },
      include: CART_INCLUDE,
    });
  }

  return toCartDto(cart);
}

export async function getCartWithItems(cartId: string) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: CART_INCLUDE,
  });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  return toCartDto(cart);
}

export async function addItemToCart(
  cartId: string,
  data: AddToCartInput,
  userId?: string,
) {
  const { productId, variantId, quantity } = data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      originalPrice: true,
      discount: true,
      images: true,
      inStock: true,
      status: true,
      stock: true,
      variants: {
        where: variantId ? { id: variantId } : undefined,
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          sku: true,
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.status !== "ACTIVE") {
    throw new BadRequestError("Product is not active");
  }

  const variant = variantId ? product.variants[0] : null;

  if (variantId && !variant) {
    throw new NotFoundError("Product variant not found");
  }

  if (!product.inStock) {
    throw new BadRequestError("Product is out of stock");
  }

  const availableStock = variant ? variant.stock : product.stock;

  if (availableStock < quantity) {
    throw new BadRequestError(`Insufficient stock. Available: ${availableStock}`);
  }

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        where: {
          productId,
          ...(variantId ? { variantId } : { variantId: null }),
        },
        select: {
          id: true,
          quantity: true,
          productId: true,
          variantId: true,
        },
      },
    },
  });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  if (cart.userId && userId && cart.userId !== userId) {
    throw new ConflictError("Cannot modify cart belonging to another user");
  }

  const existingItem = cart.items[0];

  await prisma.$transaction(async (tx) => {
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const newStock = variant ? variant.stock : product.stock;

      if (newStock < newQuantity) {
        throw new BadRequestError(`Insufficient stock after adding. Available: ${newStock}, requested: ${newQuantity}`);
      }

      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId,
          productId,
          variantId,
          quantity,
        },
      });
    }
  });

  return getCartWithItems(cartId);
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
      product: true,
    },
  });

  if (!cartItem) {
    throw new NotFoundError("Cart item not found");
  }

  const availableStock = cartItem.product.stock;

  if (availableStock < quantity) {
    throw new BadRequestError(`Insufficient stock. Available: ${availableStock}`);
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return getCartWithItems(cartItem.cartId);
}

export async function removeCartItem(cartItemId: string) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
    },
  });

  if (!cartItem) {
    throw new NotFoundError("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return getCartWithItems(cartItem.cartId);
}

export async function clearCart(cartId: string) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: true },
  });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  await prisma.cartItem.deleteMany({
    where: { cartId },
  });

  return getCartWithItems(cartId);
}

export async function getGuestCart(sessionId: string) {
  const cart = await prisma.cart.findFirst({
    where: { sessionId },
    include: CART_INCLUDE,
  });

  if (!cart) {
    throw new NotFoundError("Guest cart not found");
  }

  return toCartDto(cart);
}

export async function getOrCreateSessionCart(sessionId: string) {
  let cart = await prisma.cart.findFirst({
    where: { sessionId },
    include: CART_INCLUDE,
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: CART_INCLUDE,
    });
  }

  return toCartDto(cart);
}

export async function getOrCreateUserCart(userId: string) {
  return getOrCreateCart(userId);
}

export const CartService = {
  getOrCreateCart,
  getCartWithItems,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getGuestCart,
  getOrCreateSessionCart,
  getOrCreateUserCart,
};

export default CartService;
