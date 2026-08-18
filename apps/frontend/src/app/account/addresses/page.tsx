"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";

interface Address {
  id: number;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postal: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [];

const emptyForm = { fullName: "", phone: "", street: "", city: "", postal: "" };

export default function AddressesPage() {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const setDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success(t("addresses.setDefault"));
  };

  const addAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Address = {
      id: Date.now(),
      ...form,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, next]);
    setForm(emptyForm);
    setShowForm(false);
    toast.success(t("addresses.add"));
  };

  const deleteAddress = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success(t("addresses.delete"));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">{t("addresses.title")}</h1>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary !h-9 !px-4 !text-xs rounded-xl"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {t("addresses.addNew")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addAddress} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">{t("addresses.formTitle")}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">{t("addresses.fullName")} *</label>
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">{t("addresses.phone")} *</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-foreground">{t("addresses.street")} *</label>
              <input
                required
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">{t("addresses.city")} *</label>
              <input
                required
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">{t("addresses.postal")}</label>
              <input
                type="text"
                value={form.postal}
                onChange={(e) => setForm({ ...form, postal: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              {t("addresses.cancel")}
            </button>
            <button type="submit" className="btn-primary !h-9 !px-4 !text-xs rounded-xl">
              {t("addresses.add")}
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">{t("addresses.empty")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t("addresses.emptyHint")}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="relative rounded-2xl border border-border bg-card p-4">
              {address.isDefault && (
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  {t("addresses.default")}
                </span>
              )}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{address.fullName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{address.phone}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {address.street}, {address.city}
                    {address.postal ? `, ${address.postal}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => setDefault(address.id)}
                    className="text-[11px] font-medium text-primary transition-colors hover:underline"
                  >
                    {t("addresses.setDefault")}
                  </button>
                )}
                <span className="mx-1 text-border">·</span>
                <button
                  onClick={() => toast.info(t("addresses.edit"))}
                  className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Pencil className="h-3 w-3" />
                  {t("addresses.edit")}
                </button>
                <span className="mx-1 text-border">·</span>
                <button
                  onClick={() => deleteAddress(address.id)}
                  className="flex items-center gap-1 text-[11px] font-medium text-error transition-colors hover:underline"
                >
                  <Trash2 className="h-3 w-3" />
                  {t("addresses.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
