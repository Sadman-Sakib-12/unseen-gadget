"use client";
import { X } from "lucide-react";
import { Delivery } from "@/features/delivery/types";
import { useState } from "react";

interface DeliveryAssignModalProps {
  delivery: Delivery | null;
  onClose: () => void;
  onAssign: (deliveryId: string, courier: string, tracking: string) => void;
}

export function DeliveryAssignModal({ delivery, onClose, onAssign }: DeliveryAssignModalProps) {
  if (!delivery) return null;
  const [courier, setCourier] = useState(delivery.courier);
  const [tracking, setTracking] = useState(delivery.trackingNumber);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(delivery.id, courier, tracking);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Assign Courier</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Order: {delivery.orderId} - {delivery.customerName}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Courier</label>
            <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={courier} onChange={(e) => setCourier(e.target.value)}>
              <option value="Pathao">Pathao</option>
              <option value="Steadfast">Steadfast</option>
              <option value="RedX">RedX</option>
              <option value="eCourier">eCourier</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tracking Number</label>
            <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={tracking} onChange={(e) => setTracking(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Assign</button>
          </div>
        </form>
      </div>
    </div>
  );
}
