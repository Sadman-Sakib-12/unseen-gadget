"use client";

import { useState, useEffect } from "react";
import { MapPin, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

import { useSession } from "next-auth/react";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  zipCode?: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const { status } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/address");
      setAddresses(res.data || []);
    } catch (e: any) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Could not fetch addresses:", e?.message);
      }
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status]);

  const createAddress = async (data: {
    name: string;
    phone: string;
    address: string;
    city: string;
    zipCode?: string;
  }) => {
    setLoading(true);
    try {
      await apiRequest("/address", {
        method: "POST",
        body: JSON.stringify(data),
      });
      fetchAddresses();
      toast.success("Address added");
    } catch (e: any) {
      toast.error(e?.error || e?.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const removeAddress = async (id: string) => {
    setLoading(true);
    try {
      await apiRequest(`/address/${id}`, { method: "DELETE" });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address removed");
    } catch (e: any) {
      toast.error(e?.error || e?.message || "Failed to remove address");
    } finally {
      setLoading(false);
    }
  };

  const setDefault = async (id: string) => {
    try {
      await apiRequest(`/address/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isDefault: true }),
      });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
      toast.success("Default address updated");
    } catch (e: any) {
      toast.error(e?.error || e?.message || "Failed to update default address");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">My Addresses</h1>
        </div>
        {loading ? (
          <span className="text-sm text-muted-foreground">Loading...</span>
        ) : addresses.length === 0 ? (
          <span className="text-sm text-muted-foreground">No addresses yet</span>
        ) : (
          <span className="text-sm text-primary">
            {addresses.length} address{addresses.length !== 1 ? "es" : ""}
          </span>
        )}
      </div>

      <button
        onClick={() => setShowForm((v) => !v)}
        className="btn-primary !h-9 !px-4 !text-xs rounded-xl"
        disabled={loading}
      >
        + Add New Address
      </button>

      {showForm && (
        <form
          onSubmit={async (e: React.FormEvent) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            await createAddress({
              name: (form.elements.namedItem("name") as HTMLInputElement).value,
              phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
              address: (form.elements.namedItem("address") as HTMLInputElement).value,
              city: (form.elements.namedItem("city") as HTMLInputElement).value,
              zipCode: (form.elements.namedItem("zipCode") as HTMLInputElement).value,
            });
            setShowForm(false);
          }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h3 className="mb-4 text-sm font-bold text-foreground">Add Address</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Full Name *</label>
              <input
                required
                type="text"
                name="name"
                className="input-field"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Phone *</label>
              <input
                required
                type="tel"
                name="phone"
                className="input-field"
                placeholder="+8801XXXXXXXXX"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-foreground">Street Address *</label>
              <input
                required
                type="text"
                name="address"
                className="input-field"
                placeholder="House, Road, Area"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">City *</label>
              <input
                required
                type="text"
                name="city"
                className="input-field"
                placeholder="Dhaka"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Postal Code</label>
              <input
                type="text"
                name="zipCode"
                className="input-field"
                placeholder="1205"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary !h-9 !px-4 !text-xs rounded-xl">
              Add
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">No addresses yet</h3>
          <p className="mt-1 text-xs text-muted-foreground">Add a shipping address for faster checkout.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="relative rounded-2xl border border-border bg-card p-4"
            >
              {address.isDefault && (
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  Default
                </span>
              )}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{address.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{address.phone}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {address.address}, {address.city}
                    {address.zipCode ? `, ${address.zipCode}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => setDefault(address.id)}
                    className="text-[11px] font-medium text-primary transition-colors hover:underline"
                  >
                    Set as default
                  </button>
                )}
                <span className="mx-1 text-border">·</span>
                <button
                  onClick={() => toast.info("Edit coming soon")}
                  className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
                <span className="mx-1 text-border">·</span>
                <button
                  onClick={() => removeAddress(address.id)}
                  className="flex items-center gap-1 text-[11px] font-medium text-error transition-colors hover:underline"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}