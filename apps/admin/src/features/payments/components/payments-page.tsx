"use client";
import { useState } from "react";
import { PaymentDetailsModal } from "@/features/payments/components/payment-details-modal";
import { PaymentsTable } from "@/features/payments/components/payments-table";
import initialPayments from "@/features/payments/data/payments.json";
import { Payment } from "@/features/payments/types";

export function PaymentsPage() {
  const [payments] = useState<Payment[]>(initialPayments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-gray-500">View and manage payment transactions</p>
      </div>
      <PaymentsTable data={payments} />
      <PaymentDetailsModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
    </div>
  );
}
