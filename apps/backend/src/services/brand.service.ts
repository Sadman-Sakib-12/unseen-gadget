import { prisma } from "@unseen-gadget/database";
import type { Prisma } from "@prisma/client";
import type { BrandCreateInput, BrandUpdateInput } from "@unseen-gadget/validations";
import { ConflictError, NotFoundError } from "../utils/errors";
import { slugify } from "../utils/slug";

export async function listBrands() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getBrandById(id: string) {
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) throw new NotFoundError("Brand not found");
  return brand;
}

export async function createBrand(data: BrandCreateInput) {
  const name = data.name.trim();
  let slug = data.slug?.trim() || slugify(name);

  let count = 1;
  const baseSlug = slug;
  while (await prisma.brand.findUnique({ where: { slug } })) {
    count++;
    slug = `${baseSlug}-${count}`;
  }

  const existingName = await prisma.brand.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existingName) {
    return prisma.brand.update({
      where: { id: existingName.id },
      data: {
        ...(data.logo !== undefined ? { logo: data.logo ?? null } : {}),
        ...(data.description !== undefined ? { description: data.description ?? null } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
      },
    });
  }

  const active = data.active !== undefined
    ? data.active
    : data.status !== undefined
      ? data.status === "active" || data.status === "ACTIVE"
      : true;

  return prisma.brand.create({
    data: {
      name,
      slug,
      logo: data.logo ?? null,
      description: data.description ?? null,
      active,
    },
  });
}

export async function updateBrand(id: string, data: BrandUpdateInput) {
  await getBrandById(id);

  const update: Prisma.BrandUpdateInput = {};
  if (data.name !== undefined) update.name = data.name.trim();
  if (data.slug !== undefined) {
    let slug = data.slug.trim() || slugify(data.name ?? "");
    const existing = await prisma.brand.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    update.slug = slug;
  }
  if (data.logo !== undefined) update.logo = data.logo ? data.logo.trim() : null;
  if (data.description !== undefined) update.description = data.description ? data.description.trim() : null;
  if (data.active !== undefined) {
    update.active = data.active;
  } else if (data.status !== undefined) {
    update.active = data.status === "active" || data.status === "ACTIVE";
  }

  return prisma.brand.update({ where: { id }, data: update });
}

export async function deleteBrand(id: string) {
  await getBrandById(id);

  const productCount = await prisma.product.count({ where: { brandId: id } });
  if (productCount > 0) {
    throw new ConflictError("Cannot delete a brand that has products");
  }

  await prisma.brand.delete({ where: { id } });
}

export const BrandService = {
  list: listBrands,
  getById: getBrandById,
  create: createBrand,
  update: updateBrand,
  remove: deleteBrand,
};

export default BrandService;