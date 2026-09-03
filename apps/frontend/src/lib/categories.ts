export interface Category {
  id: string;
  name: string;
  slug?: string;
  href: string;
  subcategories?: Category[];
}

export const DEFAULT_CATEGORIES: Category[] = [];

export function mapCategoryNodes(nodes: any[]): Category[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node) => {
    const slug = node.slug || node.id || "";
    const href = node.href || `/category/${slug}`;
    const children = node.children || node.subcategories || [];
    return {
      id: String(node.id || slug),
      name: String(node.name || slug),
      slug: String(slug),
      href,
      subcategories: children.length > 0 ? mapCategoryNodes(children) : undefined,
    };
  });
}

export function findAllCategories(dynamicCategories?: Category[]): Category[] {
  return dynamicCategories && dynamicCategories.length > 0
    ? dynamicCategories
    : [];
}

export function findCategoryByHref(items: Category[], href: string): Category | null {
  const cleanHref = href.toLowerCase().replace(/\/$/, "");
  const slugTarget = cleanHref.split("/").pop() || "";

  for (const item of items) {
    const itemHref = item.href.toLowerCase().replace(/\/$/, "");
    if (itemHref === cleanHref || item.slug === slugTarget || item.name.toLowerCase() === slugTarget.replace(/-/g, " ")) {
      return item;
    }
    if (item.subcategories) {
      const found = findCategoryByHref(item.subcategories, href);
      if (found) return found;
    }
  }
  return null;
}

export function getParentChain(items: Category[], targetHref: string): Category[] {
  const chain: Category[] = [];
  const cleanTarget = targetHref.toLowerCase().replace(/\/$/, "");

  function search(currentItems: Category[], target: string, path: Category[]): boolean {
    for (const item of currentItems) {
      const itemHref = item.href.toLowerCase().replace(/\/$/, "");
      const newPath = [...path, item];
      if (itemHref === target || item.slug === target.split("/").pop()) {
        chain.push(...newPath);
        return true;
      }
      if (item.subcategories && search(item.subcategories, target, newPath)) {
        return true;
      }
    }
    return false;
  }

  search(items, cleanTarget, []);
  return chain;
}