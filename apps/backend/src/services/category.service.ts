import { prisma } from "@unseen-gadget/database";
import type { Prisma } from "@prisma/client";
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@unseen-gadget/validations";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";
import { slugify } from "../utils/slug";

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  href: string;
  image: string | null;
  children: CategoryTreeNode[];
}

interface CategoryLeaf {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string | null;
  sortOrder: number;
}

export function toCategoryTree(categories: CategoryLeaf[]): CategoryTreeNode[] {
  const sorted = [...categories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name),
  );
  const map = new Map<string, CategoryTreeNode>();
  for (const cat of sorted) {
    map.set(cat.id, {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      href: `/category/${cat.slug}`,
      image: cat.image,
      children: [],
    });
  }
  const roots: CategoryTreeNode[] = [];
  for (const cat of sorted) {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export async function listCategoryTree(): Promise<CategoryTreeNode[]> {
  const categories = await prisma.category.findMany({
    where: { active: true },
    select: { id: true, name: true, slug: true, parentId: true, image: true, sortOrder: true },
  });
  return toCategoryTree(categories);
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new NotFoundError("Category not found");
  return category;
}

export async function createCategory(data: CategoryCreateInput) {
  const slug = data.slug?.trim() || slugify(data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw new ConflictError("A category with this slug already exists");
  if (data.parentId) await getCategoryById(data.parentId);

  const isActive =
    data.active !== undefined
      ? data.active
      : data.status !== undefined
        ? data.status === "active"
        : true;

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      parentId: data.parentId ?? null,
      image: data.image || null,
      description: data.description || null,
      sortOrder: data.sortOrder ?? 0,
      active: isActive,
    },
  });
}

export async function updateCategory(id: string, data: CategoryUpdateInput) {
  await getCategoryById(id);

  const update: Prisma.CategoryUpdateInput = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.slug !== undefined) {
    const slug = data.slug.trim() || slugify(data.name ?? "");
    const existing = await prisma.category.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) throw new ConflictError("A category with this slug already exists");
    update.slug = slug;
  }
  if (data.parentId !== undefined) {
    if (data.parentId === id) throw new BadRequestError("A category cannot be its own parent");
    if (data.parentId) await getCategoryById(data.parentId);
    update.parent = data.parentId
      ? { connect: { id: data.parentId } }
      : { disconnect: true };
  }
  if (data.image !== undefined) update.image = data.image || null;
  if (data.description !== undefined) update.description = data.description || null;
  if (data.sortOrder !== undefined) update.sortOrder = data.sortOrder;
  if (data.active !== undefined) {
    update.active = data.active;
  } else if (data.status !== undefined) {
    update.active = data.status === "active";
  }

  return prisma.category.update({ where: { id }, data: update });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    // Already deleted or not found — return gracefully
    return;
  }

  const childCount = await prisma.category.count({ where: { parentId: id } });
  if (childCount > 0) {
    throw new ConflictError("Cannot delete a category that has subcategories. Remove subcategories first.");
  }
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new ConflictError("Cannot delete a category that contains products. Reassign or delete products first.");
  }

  await prisma.category.delete({ where: { id } });
}

export const CategoryService = {
  listTree: listCategoryTree,
  list: listCategories,
  getById: getCategoryById,
  create: createCategory,
  update: updateCategory,
  remove: deleteCategory,
};

export default CategoryService;