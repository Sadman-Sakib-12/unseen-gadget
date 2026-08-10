export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  parentId: string | null;
  status: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  status: string;
}
