"use client";
import { X } from "lucide-react";
import { Delivery } from "@/features/delivery/types";

interface TrackingModalProps {
  delivery: Delivery | null;
  onClose: () => void;
}

export function TrackingModal({ delivery, onClose }: TrackingModalProps) {
  if (!delivery) return null;
  const steps = ["pending", "picked_up", "in_transit", "delivered"];
  const currentStep = steps.indexOf(delivery.status);
  const stepClass = (idx: number) => {
    if (delivery.status === "cancelled") return "border-red-500 bg-red-50";
    if (idx <= currentStep) return "border-black bg-black text-white";
    return "border-gray-300 bg-white";
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tracking Information</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tracking Number</p>
              <p className="font-mono text-sm">{delivery.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Courier</p>
              <p className="text-sm">{delivery.courier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="text-sm">{delivery.estimatedDelivery}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shipping Cost</p>
              <p className="text-sm">{delivery.shippingCost} BDT</p>
            </div>
          </div>
          <div className="pt-4">
            <p className="text-sm font-medium mb-3">Delivery Status</p>
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={"flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs " + stepClass(idx)}>
                    {idx + 1}
                  </div>
                  <span className="mt-1 text-xs capitalize">{step.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
