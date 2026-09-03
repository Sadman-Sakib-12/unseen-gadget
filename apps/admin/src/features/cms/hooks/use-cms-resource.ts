"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

/** Generic data hook for CMS collection endpoints.
 *  Uses the backend API via apiRequest. */
export function useCmsResource<T extends { id: string }>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const res = await apiRequest(endpoint, { cache: "no-store" });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await apiRequest(endpoint, { cache: "no-store" });
        if (!ignore) {
          setItems(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          toast.error("Failed to load data");
          setLoading(false);
        }
      }
    }
    void init();
    return () => {
      ignore = true;
    };
  }, [endpoint]);

  const create = async (item: T) => {
    await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(item),
    });
    await reload();
    toast.success("Created");
  };

  const update = async (item: T) => {
    await apiRequest(`${endpoint}/${item.id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    });
    await reload();
    toast.success("Saved");
  };

  const remove = async (id: string) => {
    await apiRequest(`${endpoint}/${id}`, { method: "DELETE" });
    await reload();
    toast.success("Deleted");
  };

  return { items, loading, reload, create, update, remove };
}
