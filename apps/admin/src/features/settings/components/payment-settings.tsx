"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/components/ui/utils";
import type { PaymentSettings } from "@/features/settings/types";

interface PaymentSettingsProps {
  settings: PaymentSettings;
  onSave: (settings: PaymentSettings) => void;
}

function ToggleRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 accent-gray-900"
      />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function PaymentSettingsComponent({ settings, onSave }: PaymentSettingsProps) {
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="payment-settings" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <ToggleRow
              checked={formData.acceptCashOnDelivery}
              onChange={(v) => setFormData({ ...formData, acceptCashOnDelivery: v })}
              label="Accept Cash on Delivery"
            />
            <ToggleRow
              checked={formData.acceptCardPayments}
              onChange={(v) => setFormData({ ...formData, acceptCardPayments: v })}
              label="Accept Card Payments"
            />
            <ToggleRow
              checked={formData.acceptBankTransfer}
              onChange={(v) => setFormData({ ...formData, acceptBankTransfer: v })}
              label="Accept Bank Transfer"
            />
            <ToggleRow
              checked={formData.acceptMobileBanking}
              onChange={(v) => setFormData({ ...formData, acceptMobileBanking: v })}
              label="Accept Mobile Banking"
            />
            <Field label="Tax Rate (%)">
              <Input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
              />
            </Field>
            <Field label="Currency">
              <Select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                options={[
                  { value: "BDT", label: "BDT" },
                  { value: "USD", label: "USD" },
                  { value: "INR", label: "INR" },
                ]}
              />
            </Field>
            <ToggleRow
              checked={formData.taxIncluded}
              onChange={(v) => setFormData({ ...formData, taxIncluded: v })}
              label="Tax included in price"
            />
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 transition-opacity",
                saved ? "opacity-100" : "opacity-0"
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              Settings saved
            </span>
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}