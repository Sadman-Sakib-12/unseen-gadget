"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Smartphone, DollarSign, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/components/ui/utils";
import { toast } from "sonner";
import type { PaymentSettings } from "@/features/settings/types";

interface PaymentSettingsProps {
  settings: PaymentSettings;
  onSave: (settings: PaymentSettings) => void;
}

function ToggleRow({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-gray-200/80 bg-gray-50/50 p-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary"
      />
      <div>
        <span className="block text-sm font-semibold text-gray-900">{label}</span>
        {description && <span className="text-xs text-gray-500">{description}</span>}
      </div>
    </label>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function PaymentSettingsComponent({ settings, onSave }: PaymentSettingsProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: {} } = useForm<PaymentSettings>({
    defaultValues: settings,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const onSubmit = (data: PaymentSettings) => {
    onSave(data);
    setSaved(true);
    toast.success("Payment settings saved successfully!");
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-lg font-bold">Payment & Mobile Banking Settings</CardTitle>
        <CardDescription>
          Configure accepted payment methods, bKash/Nagad phone numbers, and checkout payment rules.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form id="payment-settings" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Active Payment Methods */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <WalletCards className="h-4 w-4 text-primary" />
              Active Payment Methods
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleRow
                checked={watch('acceptCashOnDelivery')}
                onChange={(v) => setValue('acceptCashOnDelivery', v)}
                label="Cash on Delivery (COD)"
                description="Allow customers to pay upon receiving the order"
              />
              <ToggleRow
                checked={watch('acceptMobileBanking')}
                onChange={(v) => setValue('acceptMobileBanking', v)}
                label="Mobile Banking (bKash / Nagad / Rocket)"
                description="Allow customers to send money via personal mobile wallet"
              />
              <ToggleRow
                checked={watch('acceptCardPayments')}
                onChange={(v) => setValue('acceptCardPayments', v)}
                label="Card Payments (Online Gateway)"
                description="Accept Visa, MasterCard, and online debit/credit cards"
              />
              <ToggleRow
                checked={watch('acceptBankTransfer')}
                onChange={(v) => setValue('acceptBankTransfer', v)}
                label="Bank Transfer"
                description="Accept direct bank account deposits"
              />
            </div>
          </div>

          {/* Mobile Banking Numbers Section */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
            <div className="mb-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-primary">
                <Smartphone className="h-4 w-4" />
                Mobile Banking Personal Numbers (Send Money)
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                These phone numbers will be displayed to customers on the checkout page when they choose bKash or Nagad.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="bKash Personal Number" hint="Shown on bKash checkout">
                <Input
                    type="text"
                    placeholder="e.g. 01XXXXXXXXX"
                    {...register('bkashNumber')}
                    className="bg-white font-mono"
                  />
              </Field>

              <Field label="Nagad Personal Number" hint="Shown on Nagad checkout">
                <Input
                    type="text"
                    placeholder="e.g. 01XXXXXXXXX"
                    {...register('nagadNumber')}
                    className="bg-white font-mono"
                  />
              </Field>

              <Field label="Rocket Number (Optional)" hint="Optional wallet">
                <Input
                    type="text"
                    placeholder="e.g. 01XXXXXXXXX"
                    {...register('rocketNumber')}
                    className="bg-white font-mono"
                  />
              </Field>

              <Field label="Payment Instructions / Note" hint="Optional notes">
                <Input
                    type="text"
                    placeholder="e.g. Please use 'Send Money' option only"
                    {...register('mobileBankingInstructions')}
                    className="bg-white"
                  />
              </Field>
            </div>
          </div>

          {/* Tax & Currency */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <DollarSign className="h-4 w-4 text-primary" />
              Currency & Taxes
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Currency">
                <Select
                    {...register('currency')}
                    options={[
                      { value: "BDT", label: "BDT (৳)" },
                      { value: "USD", label: "USD ($)" },
                      { value: "INR", label: "INR (₹)" },
                    ]}
                  />
              </Field>

              <Field label="Tax Rate (%)">
                <Input
                    type="number"
                    min="0"
                    step="0.1"
                    {...register('taxRate')}
                  />
              </Field>

              <div className="sm:col-span-2">
                <ToggleRow
                checked={watch('taxIncluded')}
                onChange={(v) => setValue('taxIncluded', v)}
                label="Tax included in product price"
                description="Check if prices on the store already include applicable taxes"
              />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 transition-opacity",
                saved ? "opacity-100" : "opacity-0"
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              Settings saved successfully
            </span>
            <Button type="submit" className="min-w-[120px]">
              Save Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}