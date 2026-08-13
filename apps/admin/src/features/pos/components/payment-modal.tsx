"use client";

import { useState } from "react";
import { CreditCard, Wallet, Smartphone, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import { formatBDT } from "@/lib/load-dashboard-data";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (method: string, reference?: string) => void;
}

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Wallet, color: "text-green-600" },
  { id: "card", label: "Card", icon: CreditCard, color: "text-blue-600" },
  { id: "mobile", label: "Mobile Banking", icon: Smartphone, color: "text-purple-600" },
];

export function PaymentModal({ isOpen, onClose, total, onConfirm }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("cash");
  const [reference, setReference] = useState("");
  const [step, setStep] = useState<"method" | "processing" | "success">("method");

  const handleConfirm = () => {
    if (step === "method") {
      setStep("processing");
      window.setTimeout(() => {
        setStep("success");
      }, 1500);
    } else if (step === "success") {
      onConfirm(selectedMethod, reference);
      setStep("method");
      setReference("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>{step === "success" ? "Payment Successful" : "Payment"}</DialogTitle>
        <DialogDescription>
          {step === "success"
            ? `Received ${formatBDT(total)} for this sale.`
            : "Confirm the payment method to complete the sale."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="space-y-4">
        {step === "method" && (
          <>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">{formatBDT(total)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Select Payment Method</p>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                      selectedMethod === method.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Icon className={`h-5 w-5 ${method.color}`} />
                    <span className="text-sm font-medium text-gray-900">{method.label}</span>
                    {selectedMethod === method.id && (
                      <CheckCircle2 className="ml-auto h-5 w-5 text-gray-900" />
                    )}
                  </button>
                );
              })}
            </div>
            {selectedMethod !== "cash" && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Reference Number
                </label>
                <Input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter transaction reference"
                />
              </div>
            )}
            <Button type="button" className="w-full" size="lg" onClick={handleConfirm}>
              Confirm Payment
            </Button>
          </>
        )}

        {step === "processing" && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
            <p className="text-lg font-medium text-gray-900">Processing Payment...</p>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
            <p className="text-lg font-medium text-gray-900">Payment Received</p>
            <p className="mt-1 text-sm text-gray-500">{formatBDT(total)}</p>
            <Badge variant="success" className="mt-2">
              PAID
            </Badge>
            <Button type="button" className="mt-6 w-full" size="lg" onClick={handleConfirm}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}