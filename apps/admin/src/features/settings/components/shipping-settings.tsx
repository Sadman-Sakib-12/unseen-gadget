"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import type { ShippingSettings } from "@/features/settings/types";

interface ShippingSettingsProps {
  settings: ShippingSettings;
  onSave: (settings: ShippingSettings) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function ShippingSettingsComponent({ settings, onSave }: ShippingSettingsProps) {
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
        <CardTitle>Shipping Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="shipping-settings" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Free Shipping Threshold (BDT)">
              <Input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Default Shipping Cost (BDT)">
              <Input
                type="number"
                value={formData.defaultShippingCost}
                onChange={(e) =>
                  setFormData({ ...formData, defaultShippingCost: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Express Shipping Cost (BDT)">
              <Input
                type="number"
                value={formData.expressShippingCost}
                onChange={(e) =>
                  setFormData({ ...formData, expressShippingCost: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Standard Delivery (days)">
              <Input
                type="number"
                value={formData.estimatedDeliveryDays.standard}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedDeliveryDays: {
                      ...formData.estimatedDeliveryDays,
                      standard: Number(e.target.value),
                    },
                  })
                }
              />
            </Field>
            <Field label="Express Delivery (days)">
              <Input
                type="number"
                value={formData.estimatedDeliveryDays.express}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedDeliveryDays: {
                      ...formData.estimatedDeliveryDays,
                      express: Number(e.target.value),
                    },
                  })
                }
              />
            </Field>
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