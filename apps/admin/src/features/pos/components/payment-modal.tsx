"use client";

import { useState } from "react";
import { X, CreditCard, Wallet, Smartphone, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (step === "method") {
      setStep("processing");
      setTimeout(() => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {step === "success" ? "Payment Successful" : "Payment"}
          </CardTitle>
          {step !== "processing" && (
            <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "method" && (
            <>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-3xl font-bold">{total.toLocaleString()} BDT</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Select Payment Method</p>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                      selectedMethod === method.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <method.icon className={`h-5 w-5 ${method.color}`} />
                    <span className="font-medium">{method.label}</span>
                    {selectedMethod === method.id && (
                      <CheckCircle2 className="ml-auto h-5 w-5 text-black" />
                    )}
                  </button>
                ))}
              </div>
              {selectedMethod !== "cash" && (
                <div>
                  <label className="text-sm font-medium">Reference Number</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Enter transaction reference"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              )}
              <button
                onClick={handleConfirm}
                className="w-full rounded-lg bg-black py-3 text-white font-medium hover:bg-gray-800"
              >
                Confirm Payment
              </button>
            </>
          )}

          {step === "processing" && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
              <p className="text-lg font-medium">Processing Payment...</p>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
              <p className="text-lg font-medium">Payment Received</p>
              <p className="text-sm text-gray-500 mt-1">{total.toLocaleString()} BDT</p>
              <Badge variant="success" className="mt-2">PAID</Badge>
              <button
                onClick={handleConfirm}
                className="mt-6 w-full rounded-lg bg-black py-3 text-white font-medium hover:bg-gray-800"
              >
                Done
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
