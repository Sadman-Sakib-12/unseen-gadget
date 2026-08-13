"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import type { EmailSettings } from "@/features/settings/types";

interface EmailSettingsProps {
  settings: EmailSettings;
  onSave: (settings: EmailSettings) => void;
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

export function EmailSettingsComponent({ settings, onSave }: EmailSettingsProps) {
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
        <CardTitle>Email Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="email-settings" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="SMTP Host">
              <Input
                type="text"
                value={formData.smtpHost}
                onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
              />
            </Field>
            <Field label="SMTP Port">
              <Input
                type="number"
                value={formData.smtpPort}
                onChange={(e) => setFormData({ ...formData, smtpPort: Number(e.target.value) })}
              />
            </Field>
            <Field label="SMTP User">
              <Input
                type="text"
                value={formData.smtpUser}
                onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
              />
            </Field>
            <Field label="Sender Email">
              <Input
                type="email"
                value={formData.senderEmail}
                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
              />
            </Field>
            <ToggleRow
              checked={formData.sendOrderConfirmation}
              onChange={(v) => setFormData({ ...formData, sendOrderConfirmation: v })}
              label="Send order confirmation emails"
            />
            <ToggleRow
              checked={formData.sendShippingUpdate}
              onChange={(v) => setFormData({ ...formData, sendShippingUpdate: v })}
              label="Send shipping update emails"
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