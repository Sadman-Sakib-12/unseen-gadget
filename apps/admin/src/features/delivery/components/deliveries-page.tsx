"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { DeliveriesTable } from "@/features/delivery/components/deliveries-table";
import { DeliveryAssignModal } from "@/features/delivery/components/delivery-assign-modal";
import { TrackingModal } from "@/features/delivery/components/tracking-modal";
import initialDeliveries from "@/features/delivery/data/deliveries.json";
import { Delivery } from "@/features/delivery/types";

export function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [assignModal, setAssignModal] = useState<Delivery | null>(null);
  const [trackingModal, setTrackingModal] = useState<Delivery | null>(null);

  const handleAssign = (deliveryId: string, courier: string, tracking: string) => {
    setDeliveries(deliveries.map((d) => (d.id === deliveryId ? { ...d, courier, trackingNumber: tracking } : d)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
          <p className="text-gray-500">Track and manage shipments</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          <Plus size={16} />
          Add Delivery
        </button>
      </div>
      <DeliveriesTable data={deliveries} />
      <DeliveryAssignModal delivery={assignModal} onClose={() => setAssignModal(null)} onAssign={handleAssign} />
      <TrackingModal delivery={trackingModal} onClose={() => setTrackingModal(null)} />
    </div>
  );
}
