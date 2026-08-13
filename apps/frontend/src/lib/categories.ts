import categories from "@/data/categories.json";

export interface Category {
  id: string;
  name: string;
  href: string;
  subcategories?: Category[];
}

export function findAllCategories(): Category[] {
  return categories as Category[];
}

export function findCategoryByHref(items: Category[], href: string): Category | null {
  for (const item of items) {
    if (item.href === href) return item;
    if (item.subcategories) {
      const found = findCategoryByHref(item.subcategories, href);
      if (found) return found;
    }
  }
  return null;
}

export function getParentChain(items: Category[], targetHref: string): Category[] {
  const chain: Category[] = [];

  function search(currentItems: Category[], target: string, path: Category[]): boolean {
    for (const item of currentItems) {
      const newPath = [...path, item];
      if (item.href === target) {
        chain.push(...newPath);
        return true;
      }
      if (item.subcategories && search(item.subcategories, target, newPath)) {
        return true;
      }
    }
    return false;
  }

  search(items, targetHref, []);
  return chain;
}