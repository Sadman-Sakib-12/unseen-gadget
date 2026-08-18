"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CmsListResponse<T> {
  items: T[];
}

/** Generic data hook for the CMS collection endpoints
 *  (/api/cms/jobs, /api/cms/posts, /api/cms/promotions). */
export function useCmsResource<T extends { id: string }>(url: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as T[];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(
    async (method: "POST" | "PUT" | "DELETE", body: unknown, id?: string) => {
      const res = await fetch(
        id ? `${url}?id=${encodeURIComponent(id)}` : url,
        {
          method,
          headers: body === undefined ? undefined : { "Content-Type": "application/json" },
          body: body === undefined ? undefined : JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error("Request failed");
      const json = (await res.json()) as CmsListResponse<T>;
      setItems(json.items ?? []);
    },
    [url]
  );

  const create = async (item: T) => {
    await save("POST", item);
    toast.success("Created");
  };

  const update = async (item: T) => {
    await save("PUT", item, item.id);
    toast.success("Saved");
  };

  const remove = async (id: string) => {
    await save("DELETE", undefined, id);
    toast.success("Deleted");
  };

  return { items, loading, reload, create, update, remove };
}