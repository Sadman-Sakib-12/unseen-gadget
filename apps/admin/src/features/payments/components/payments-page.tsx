'use client';

import { useState, useEffect } from "react";
import { BadgeCheck, CreditCard, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { PaymentsTable } from "@/features/payments/components/payments-table";
import { PaymentDetailsModal } from "@/features/payments/components/payment-details-modal";
import { apiRequest } from "@/lib/api";
import type { Payment } from "@/features/payments/types";
import { formatBDT } from "@/lib/load-dashboard-data";

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await apiRequest("/admin/payments", { credentials: "include" });
        if (res.success && res.data) {
          const raw = Array.isArray(res.data)
            ? res.data
            : typeof res.data === 'object' && res.data !== null && Array.isArray((res.data as { payments?: unknown[] }).payments)
            ? (res.data as { payments: unknown[] }).payments
            : [];
          const list: Payment[] = (raw as Array<Record<string, unknown>>).map((p) => ({
            id: String(p.id ?? ''),
            transactionId: String(p.transactionId || "N/A"),
            orderId: String(p.orderId || (p.order as { id?: string })?.id || "N/A"),
            customerName: String(p.customerName || (p.order as { customerName?: string })?.customerName || "Customer"),
            amount: Number(p.amount ?? 0),
            method: String(p.method || "CASH_ON_DELIVERY"),
            status: String(p.status || "PENDING"),
            date: String(p.createdAt || p.date || new Date().toISOString()),
            paymentGateway: String(p.paymentGateway || p.method || "Direct"),
          }));
          setPayments(list);
        }
      } catch (e: unknown) {
        console.error("Failed to fetch payments:", e);
      }
    };
    fetchPayments();
  }, []);

  const safePayments = Array.isArray(payments) ? payments : [];
  const stats = {
    total: safePayments.length,
    completed: safePayments.filter((p) => {
      const s = String(p?.status || "").toUpperCase();
      return s === "COMPLETED" || s === "APPROVED" || s === "PAID";
    }).length,
    pending: safePayments.filter((p) => {
      const s = String(p?.status || "").toUpperCase();
      return s === "PENDING" || s === "PROCESSING";
    }).length,
    failed: safePayments.filter((p) => {
      const s = String(p?.status || "").toUpperCase();
      return s === "FAILED" || s === "REJECTED";
    }).length,
    volume: safePayments
      .filter((p) => {
        const s = String(p?.status || "").toUpperCase();
        return s === "COMPLETED" || s === "APPROVED" || s === "PAID";
      })
      .reduce((sum, p) => sum + (Number(p?.amount) || 0), 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="View and manage payment transactions."
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total transactions"
          value={stats.total}
          icon={WalletCards}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={BadgeCheck}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={CreditCard}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Volume"
          value={formatBDT(stats.volume)}
          icon={CreditCard}
          iconClassName="bg-violet-50 text-violet-700"
        />
      </div>

      <PaymentsTable data={payments} onView={setSelectedPayment} />

      <PaymentDetailsModal
        key={selectedPayment?.id ?? "payment"}
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onStatusUpdated={(paymentId, newStatus) => {
          setPayments((prev) =>
            prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p))
          );
        }}
      />
    </div>
  );
}