import { prisma } from "@unseen-gadget/database";
import type { Prisma } from "@prisma/client";
import type {
  ProductCreateInput,
  ProductQueryInput,
  ProductUpdateInput,
} from "@unseen-gadget/validations";
import { ConflictError, NotFoundError } from "../utils/errors";
import { slugify } from "../utils/slug";

const PRODUCT_INCLUDE = {
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true, logo: true } },
  variants: { orderBy: { name: "asc" as const } },
} satisfies Prisma.ProductInclude;

const PRODUCT_DETAIL_INCLUDE = PRODUCT_INCLUDE;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_INCLUDE;
}>;

type ProductWithDetail = ProductWithRelations;

export interface ProductVariantDto {
  id: string;
  name: string;
  price: number | null;
  stock: number;
  sku: string | null;
  images: string[];
}

export interface ProductListItemDto {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string | null;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  status: string;
  sku: string | null;
  barcode: string | null;
  description: string | null;
  warranty: string | null;
  image: string | null;
  images: string[];
  badge: string | null;
  colors: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  featured: boolean;
  specifications: Record<string, unknown> | null;
  shippingType: "FREE" | "PAID";
  shippingCost: number;
  variants: ProductVariantDto[];
}

export interface ProductDetailDto extends ProductListItemDto {
  features: string[];
  deliveryInfo: Record<string, unknown> | null;
  warrantyInfo: unknown[] | null;
  categoryId: string;
  brandId: string | null;
  createdAt: string;
}

export interface ReviewSummary {
  total: number;
  average: number;
  distribution: { star: number; count: number }[];
  items: {
    id: string;
    rating: number;
    comment: string | null;
    helpful: number;
    author: string;
    createdAt: string;
  }[];
}

function toListItem(p: ProductWithRelations): ProductListItemDto {
  const originalPrice = p.originalPrice ?? p.price;
  const discount =
    p.discount ?? (originalPrice > p.price
      ? Math.round(((originalPrice - p.price) / originalPrice) * 100)
      : 0);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category.name,
    brand: p.brand?.name ?? null,
    price: p.price,
    originalPrice,
    discount,
    stock: p.stock,
    status: p.status,
    sku: p.sku ?? null,
    barcode: p.barcode ?? null,
    description: p.description ?? null,
    warranty: p.warranty ?? null,
    image: p.images[0] ?? null,
    images: p.images,
    badge: p.badge,
    colors: p.colors,
    inStock: p.inStock,
    rating: p.rating ?? 0,
    reviews: p.ratingCount,
    featured: p.featured,
    specifications: p.specifications as Record<string, unknown> | null,
    shippingType: p.shippingType,
    shippingCost: p.shippingCost,
    variants: (p.variants ?? []).map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      stock: v.stock,
      sku: v.sku,
      images: v.images ?? [],
    })),
  };
}

function toDetail(p: ProductWithDetail): ProductDetailDto {
  return {
    ...toListItem(p),
    description: p.description,
    features: p.features,
    specifications: p.specifications as Record<string, unknown> | null,
    deliveryInfo: p.deliveryInfo as Record<string, unknown> | null,
    warranty: p.warranty,
    warrantyInfo: Array.isArray(p.warrantyInfo) ? p.warrantyInfo : null,
    sku: p.sku,
    barcode: p.barcode,
    categoryId: p.categoryId,
    brandId: p.brandId,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
  };
}

function buildWhere(
  query: ProductQueryInput,
  opts: { activeOnly: boolean },
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  if (opts.activeOnly) where.status = "ACTIVE";

  if (query.q) {
    const term = query.q.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { badge: { contains: term, mode: "insensitive" } },
      { brand: { name: { contains: term, mode: "insensitive" } } },
      { brand: { slug: { contains: term, mode: "insensitive" } } },
      { category: { name: { contains: term, mode: "insensitive" } } },
      { category: { slug: { contains: term, mode: "insensitive" } } },
    ];
  }
  if (query.category) {
    const rawCat = query.category.trim();
    const cat = rawCat.toLowerCase();
    const catKeywords: Record<string, string[]> = {
      phones: ["phone", "smartphone", "iphone", "android", "samsung galaxy"],
      smartphones: ["phone", "smartphone", "iphone", "android", "samsung galaxy"],
      iphones: ["iphone", "apple iphone"],
      "android-zone": ["android", "samsung", "xiaomi", "redmi", "oneplus", "pixel"],
      computers: ["computer", "laptop", "macbook", "pc", "imac", "desktop"],
      laptops: ["laptop", "macbook", "notebook", "ultrabook"],
      macbooks: ["macbook", "mac book", "macbook air", "macbook pro"],
      "ipads-tablets": ["ipad", "tablet", "tab", "galaxy tab"],
      ipads: ["ipad", "ipad pro", "ipad air", "ipad mini"],
      tablets: ["tablet", "tab", "ipad"],
      audio: ["audio", "headphone", "earphone", "speaker", "airpods", "earbuds", "tws", "soundbar"],
      airpods: ["airpods", "airpod", "air pods", "air pod"],
      headphones: ["headphone", "headphones", "headset"],
      tws: ["tws", "earbuds", "wireless earbuds", "true wireless"],
      smartwatches: ["watch", "smartwatch", "apple watch", "galaxy watch", "fitness band"],
      "apple-watch": ["apple watch", "iwatch"],
      "smart-watches": ["watch", "smartwatch"],
      accessories: ["accessory", "accessories", "cable", "case", "cover", "charger", "adapter", "power bank", "protector"],
      "power-bank": ["power bank", "powerbank", "portable charger", "battery pack"],
      cables: ["cable", "cord", "lightning", "type-c", "usb-c"],
      "iphone-cases": ["iphone case", "iphone cover", "case"],
      "ipad-cases": ["ipad case", "ipad cover", "keyboard case"],
      "macbook-protection": ["macbook case", "macbook sleeve", "sleeve", "bag"],
      gaming: ["gaming", "game", "ps5", "xbox", "controller", "nintendo"],
    };

    const keywords = catKeywords[cat] || [cat.replace(/-/g, " ")];

    const categoryConditions: Prisma.ProductWhereInput[] = [
      { category: { slug: { equals: rawCat, mode: "insensitive" } } },
      { category: { name: { contains: cat.replace(/-/g, " "), mode: "insensitive" } } },
      { category: { parent: { slug: { equals: rawCat, mode: "insensitive" } } } },
      { category: { parent: { name: { contains: cat.replace(/-/g, " "), mode: "insensitive" } } } },
      ...keywords.map((kw) => ({
        name: { contains: kw, mode: "insensitive" as const },
      })),
      ...keywords.map((kw) => ({
        description: { contains: kw, mode: "insensitive" as const },
      })),
    ];

    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: categoryConditions }];
      delete where.OR;
    } else {
      where.OR = categoryConditions;
    }
  }
  if (query.brand) {
    const brand = query.brand.trim();
    where.brand = {
      OR: [
        { slug: { equals: brand, mode: "insensitive" } },
        { name: { equals: brand, mode: "insensitive" } },
      ],
    };
  }
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) where.price.gte = query.minPrice;
    if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
  }
  if (query.inStock === "true") where.inStock = true;
  if (query.inStock === "false") where.inStock = false;
  if (query.featured === "true") where.featured = true;

  return where;
}

function buildOrderBy(
  sort?: string,
): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return [{ price: "asc" }];
    case "price_desc":
      return [{ price: "desc" }];
    case "rating":
      return [{ rating: "desc" }, { ratingCount: "desc" }];
    case "popular":
      return [{ ratingCount: "desc" }, { rating: "desc" }];
    case "featured":
      return [{ featured: "desc" }, { createdAt: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

export interface ProductListResult {
  items: ProductListItemDto[];
  total: number;
  page: number;
  limit: number;
}

export async function listProducts(query: ProductQueryInput): Promise<ProductListResult> {
  const page = query.page ?? 1;
  const limit = Math.min(query.limit ?? 20, 100);
  const where = buildWhere(query, { activeOnly: true });

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip: (page - 1) * limit,
      take: limit,
      include: PRODUCT_INCLUDE,
    }),
  ]);

  return { items: items.map(toListItem), total, page, limit };
}

export async function listAdminProducts(query: ProductQueryInput): Promise<ProductListResult> {
  const page = query.page ?? 1;
  const limit = Math.min(query.limit ?? 20, 100);
  const where = buildWhere(query, { activeOnly: false });

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip: (page - 1) * limit,
      take: limit,
      include: PRODUCT_INCLUDE,
    }),
  ]);

  return { items: items.map(toListItem), total, page, limit };
}

export async function getProductDetailBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: PRODUCT_DETAIL_INCLUDE,
  });
  if (!product) throw new NotFoundError("Product not found");

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId, 4),
    getReviewSummary(product.id),
  ]);

  return { product: toDetail(product), related, reviews };
}

export async function getAdminProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: PRODUCT_DETAIL_INCLUDE,
  });
  if (!product) throw new NotFoundError("Product not found");
  return toDetail(product);
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
): Promise<ProductListItemDto[]> {
  // 1. Try to find products in the same category
  const items = await prisma.product.findMany({
    where: { status: "ACTIVE", categoryId, NOT: { id: productId } },
    orderBy: [{ ratingCount: "desc" }, { rating: "desc" }],
    take: limit,
    include: PRODUCT_INCLUDE,
  });

  // 2. If fewer than limit, fill up with other active products in the catalog
  if (items.length < limit) {
    const excludedIds = [productId, ...items.map((p) => p.id)];
    const additional = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        id: { notIn: excludedIds },
      },
      orderBy: [{ ratingCount: "desc" }, { createdAt: "desc" }],
      take: limit - items.length,
      include: PRODUCT_INCLUDE,
    });
    items.push(...additional);
  }

  return items.map(toListItem);
}

export async function getNewArrivals(limit = 8): Promise<ProductListItemDto[]> {
  const items = await prisma.product.findMany({
    where: { status: "ACTIVE", inStock: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: PRODUCT_INCLUDE,
  });
  return items.map(toListItem);
}

export async function getTopSelling(limit = 8): Promise<ProductListItemDto[]> {
  const items = await prisma.product.findMany({
    where: { status: "ACTIVE", inStock: true },
    orderBy: [{ orderItems: { _count: "desc" } }, { ratingCount: "desc" }],
    take: limit,
    include: PRODUCT_INCLUDE,
  });
  return items.map(toListItem);
}

export async function getReviewSummary(productId: string): Promise<ReviewSummary> {
  const reviews = await prisma.review.findMany({
    where: { productId, status: "APPROVED" },
    select: {
      id: true,
      rating: true,
      comment: true,
      helpful: true,
      createdAt: true,
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = reviews.length;
  const average = total
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
    : 0;

  return {
    total,
    average,
    distribution: [1, 2, 3, 4, 5].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    })),
    items: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      helpful: r.helpful,
      author: r.user.name ?? "Anonymous",
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function getProductReviewsBySlug(slug: string): Promise<ReviewSummary> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!product) throw new NotFoundError("Product not found");
  return getReviewSummary(product.id);
}

async function resolveCategoryByName(name: string) {
  const trimmed = name?.trim() || "General";
  const slug = slugify(trimmed) || "general";
  const found = await prisma.category.findFirst({
    where: {
      OR: [
        { name: { equals: trimmed, mode: "insensitive" } },
        { slug: { equals: slug, mode: "insensitive" } },
      ],
    },
  });
  if (found) return found;

  let uniqueSlug = slug;
  let count = 1;
  while (await prisma.category.findUnique({ where: { slug: uniqueSlug } })) {
    count++;
    uniqueSlug = `${slug}-${count}`;
  }

  return prisma.category.create({ data: { name: trimmed, slug: uniqueSlug } });
}

async function resolveBrandByName(name: string) {
  const trimmed = name?.trim();
  if (!trimmed) return null;
  const slug = slugify(trimmed) || "brand";
  const found = await prisma.brand.findFirst({
    where: {
      OR: [
        { name: { equals: trimmed, mode: "insensitive" } },
        { slug: { equals: slug, mode: "insensitive" } },
      ],
    },
  });
  if (found) return found;

  const nameExists = await prisma.brand.findFirst({
    where: { name: { equals: trimmed, mode: "insensitive" } },
  });
  if (nameExists) return nameExists;

  let uniqueSlug = slug;
  let count = 1;
  while (await prisma.brand.findUnique({ where: { slug: uniqueSlug } })) {
    count++;
    uniqueSlug = `${slug}-${count}`;
  }

  return prisma.brand.create({ data: { name: trimmed, slug: uniqueSlug } });
}

async function generateUniqueSlug(baseName: string, existingId?: string): Promise<string> {
  const base = slugify(baseName) || "product";
  let slug = base;
  let count = 1;
  while (true) {
    const found = await prisma.product.findUnique({ where: { slug } });
    if (!found || (existingId && found.id === existingId)) {
      return slug;
    }
    count++;
    slug = `${base}-${count}`;
  }
}

function buildCreateData(data: ProductCreateInput) {
  const finalSku = data.sku && data.sku.trim() !== "" ? data.sku.trim() : null;
  const finalBarcode = data.barcode && data.barcode.trim() !== "" ? data.barcode.trim() : null;
  const finalBadge = data.badge && data.badge.trim() !== "" ? data.badge.trim() : null;
  const finalWarranty = data.warranty && data.warranty.trim() !== "" ? data.warranty.trim() : null;
  const finalDescription = data.description && data.description.trim() !== "" ? data.description.trim() : null;

  return {
    name: data.name,
    description: finalDescription,
    price: data.price,
    originalPrice: data.originalPrice,
    discount: data.discount ?? 0,
    stock: data.stock ?? 0,
    inStock: data.inStock ?? (data.stock ?? 0) > 0,
    badge: finalBadge,
    colors: data.colors ?? [],
    features: data.features ?? [],
    specifications: (data.specifications ?? undefined) as Prisma.InputJsonValue | undefined,
    deliveryInfo: (data.deliveryInfo ?? undefined) as Prisma.InputJsonValue | undefined,
    warrantyInfo: (data.warrantyInfo ?? undefined) as Prisma.InputJsonValue | undefined,
    warranty: finalWarranty,
    images: data.images && data.images.length > 0 ? data.images : ["https://res.cloudinary.com/unseen-gadget/image/upload/default.jpg"],
    sku: finalSku,
    barcode: finalBarcode,
    shippingType: (data.shippingType as any) ?? "FREE",
    shippingCost: data.shippingType === "PAID" ? (data.shippingCost ?? 0) : 0,
    featured: data.featured ?? false,
  };
}

export async function createProduct(data: ProductCreateInput) {
  let slug = data.slug && data.slug.trim() !== "" ? slugify(data.slug) : await generateUniqueSlug(data.name);
  if (data.slug && data.slug.trim() !== "") {
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = await generateUniqueSlug(slug);
    }
  }

  let sku = data.sku && data.sku.trim() !== "" ? data.sku.trim() : null;
  if (sku) {
    let uniqueSku = sku;
    let count = 1;
    while (await prisma.product.findUnique({ where: { sku: uniqueSku } })) {
      count++;
      uniqueSku = `${sku}-${count}`;
    }
    sku = uniqueSku;
  }

  const category = await resolveCategoryByName(data.category);
  const brand = data.brand && data.brand.trim() !== "" ? await resolveBrandByName(data.brand) : null;

  const created = await prisma.product.create({
    data: {
      ...buildCreateData(data),
      slug,
      sku,
      categoryId: category.id,
      brandId: brand?.id ?? null,
      status: data.status ?? "ACTIVE",
      variants: data.variants?.length
        ? {
            create: data.variants.map((v) => ({
              name: v.name.trim(),
              price: v.price ?? null,
              stock: v.stock ?? 0,
              sku: v.sku && v.sku.trim() !== "" ? v.sku.trim() : null,
              images: v.images ?? [],
            })),
          }
        : undefined,
    },
    include: PRODUCT_DETAIL_INCLUDE,
  });

  return toDetail(created);
}

export async function updateProduct(id: string, data: ProductUpdateInput) {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!existing) throw new NotFoundError("Product not found");

  const update: Prisma.ProductUpdateInput = {};

  if (data.name !== undefined) update.name = data.name.trim();
  if (data.description !== undefined) {
    update.description = data.description && data.description.trim() !== "" ? data.description.trim() : null;
  }
  if (data.price !== undefined) update.price = data.price;
  if (data.originalPrice !== undefined) update.originalPrice = data.originalPrice;
  if (data.discount !== undefined) update.discount = data.discount;
  if (data.stock !== undefined) {
    update.stock = data.stock;
    if (data.inStock === undefined) {
      update.inStock = data.stock > 0;
    }
  }
  if (data.inStock !== undefined) update.inStock = data.inStock;
  if (data.badge !== undefined) {
    update.badge = data.badge && data.badge.trim() !== "" ? data.badge.trim() : null;
  }
  if (data.colors !== undefined) update.colors = data.colors;
  if (data.features !== undefined) update.features = data.features;
  if (data.specifications !== undefined) {
    update.specifications = (data.specifications ?? undefined) as Prisma.InputJsonValue | undefined;
  }
  if (data.deliveryInfo !== undefined) {
    update.deliveryInfo = (data.deliveryInfo ?? undefined) as Prisma.InputJsonValue | undefined;
  }
  if (data.warrantyInfo !== undefined) {
    update.warrantyInfo = (data.warrantyInfo ?? undefined) as Prisma.InputJsonValue | undefined;
  }
  if (data.warranty !== undefined) {
    update.warranty = data.warranty && data.warranty.trim() !== "" ? data.warranty.trim() : null;
  }
  if (data.images !== undefined && data.images.length > 0) {
    update.images = data.images;
  }
  if (data.barcode !== undefined) {
    update.barcode = data.barcode && data.barcode.trim() !== "" ? data.barcode.trim() : null;
  }
  if (data.shippingType !== undefined) {
    update.shippingType = data.shippingType as any;
    if (data.shippingType === "FREE") {
      update.shippingCost = 0;
    }
  }
  if (data.shippingCost !== undefined && (data.shippingType === "PAID" || (!data.shippingType && existing.shippingType === "PAID"))) {
    update.shippingCost = data.shippingCost;
  }
  if (data.featured !== undefined) update.featured = data.featured;
  if (data.status !== undefined) update.status = data.status;

  if (data.slug !== undefined) {
    const rawSlug = data.slug.trim() || slugify(data.name ?? existing.name);
    const dup = await prisma.product.findFirst({ where: { slug: rawSlug, NOT: { id } } });
    update.slug = dup ? await generateUniqueSlug(rawSlug, id) : rawSlug;
  }
  if (data.sku !== undefined) {
    const sku = data.sku && data.sku.trim() !== "" ? data.sku.trim() : null;
    if (sku) {
      const dup = await prisma.product.findFirst({ where: { sku, NOT: { id } } });
      if (dup) throw new ConflictError(`A product with SKU "${sku}" already exists`);
    }
    update.sku = sku;
  }
  if (data.category !== undefined) {
    const category = await resolveCategoryByName(data.category);
    update.category = { connect: { id: category.id } };
  }
  if (data.brand !== undefined) {
    const brand = data.brand && data.brand.trim() !== "" ? await resolveBrandByName(data.brand) : null;
    update.brand = brand ? { connect: { id: brand.id } } : { disconnect: true };
  }

  if (data.variants !== undefined) {
    await prisma.cartItem.deleteMany({
      where: { variant: { productId: id } },
    });
    await prisma.productVariant.deleteMany({ where: { productId: id } });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...update,
      variants:
        data.variants !== undefined && data.variants.length > 0
          ? {
              create: data.variants.map((v) => ({
                name: v.name.trim(),
                price: v.price ?? null,
                stock: v.stock ?? 0,
                sku: v.sku && v.sku.trim() !== "" ? v.sku.trim() : null,
                images: v.images ?? [],
              })),
            }
          : undefined,
    },
    include: PRODUCT_DETAIL_INCLUDE,
  });

  return toDetail(updated);
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Product not found");

  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    throw new ConflictError("Cannot delete a product that has order history");
  }

  await prisma.$transaction([
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.review.deleteMany({ where: { productId: id } }),
    prisma.cartItem.deleteMany({ where: { productId: id } }),
    prisma.wishlist.deleteMany({ where: { productId: id } }),
    prisma.stockMovement.deleteMany({ where: { productId: id } }),
    prisma.inventoryItem.deleteMany({ where: { productId: id } }),
    prisma.purchaseItem.deleteMany({ where: { productId: id } }),
    prisma.product.delete({ where: { id } }),
  ]);
}

export const ProductService = {
  list: listProducts,
  listAdmin: listAdminProducts,
  getBySlug: getProductDetailBySlug,
  getAdminById: getAdminProductById,
  related: getRelatedProducts,
  newArrivals: getNewArrivals,
  topSelling: getTopSelling,
  reviewsBySlug: getProductReviewsBySlug,
  create: createProduct,
  update: updateProduct,
  remove: deleteProduct,
};

export default ProductService;