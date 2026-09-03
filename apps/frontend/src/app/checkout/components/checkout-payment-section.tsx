import { CreditCard } from "lucide-react";
import { formatBDT } from "@/components/price";

interface PaymentConfig {
  acceptCashOnDelivery?: boolean;
  acceptMobileBanking?: boolean;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  mobileBankingInstructions?: string;
}

interface PaymentMethodItem {
  id: string;
  label: string;
  desc: string;
}

interface CheckoutPaymentSectionProps {
  payment: string;
  onPaymentChange: (method: string) => void;
  trxId: string;
  onTrxIdChange: (trx: string) => void;
  paymentConfig: PaymentConfig;
  paymentMethods: PaymentMethodItem[];
  total: number;
  t: (key: string) => string;
}

export function CheckoutPaymentSection({
  payment,
  onPaymentChange,
  trxId,
  onTrxIdChange,
  paymentConfig,
  paymentMethods,
  total,
  t,
}: CheckoutPaymentSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
        <CreditCard className="h-4 w-4 text-primary" />
        {t("checkout.paymentMethod")}
      </h2>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
              payment === method.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={payment === method.id}
                onChange={() => onPaymentChange(method.id)}
                className="h-4 w-4 accent-primary"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{method.label}</p>
                <p className="text-xs text-muted-foreground">{method.desc}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {(payment === "bkash" || payment === "nagad") && (
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs font-semibold text-primary">
            Send Money to {payment === "bkash" ? "bKash" : "Nagad"} Personal Number:{" "}
            <span className="font-bold text-foreground">
              {payment === "bkash"
                ? paymentConfig.bkashNumber || ""
                : paymentConfig.nagadNumber || ""}
            </span>
          </p>
          {paymentConfig.mobileBankingInstructions && (
            <p className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
              {paymentConfig.mobileBankingInstructions}
            </p>
          )}
          <p className="mt-1 text-[11px] text-muted-foreground">
            Please send {formatBDT(total)} and enter the Transaction ID below:
          </p>
          <div className="mt-3">
            <label className="mb-1 block text-xs font-medium text-foreground">
              {payment === "bkash" ? "bKash" : "Nagad"} Transaction ID (TrxID) *
            </label>
            <input
              type="text"
              required
              value={trxId}
              onChange={(e) => onTrxIdChange(e.target.value)}
              className="input-field"
              placeholder="e.g. 9J4K2L8M1"
            />
          </div>
        </div>
      )}
    </section>
  );
}
