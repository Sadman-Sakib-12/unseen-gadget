"use client";

import { useEffect, useState } from "react";
import { X, User, MapPin, Printer, ChevronDown, Calendar, CheckCircle2, Truck } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import type { Order } from "../types";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusChange?: (orderId: string, status: Order["status"]) => void;
}

export function OrderDetailsModal({ isOpen, onClose, order, onStatusChange }: OrderDetailsModalProps) {
  const [isRendered, setIsRendered] = useState(isOpen);

  // Handle animation mounting/unmounting
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered || !order) return null;

  return (
    <>
      {/* Drawer */}
      <div 
        className={`fixed top-16 bottom-0 right-0 z-40 w-full sm:w-[380px] bg-white border-l border-gray-200 flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between p-5 border-b border-gray-100 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              <Calendar className="h-3.5 w-3.5" />
              Placed on {order.date} | 10:30 AM
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
            
            {/* Customer */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <User className="h-4 w-4" />
                Customer
              </div>
              <div className="ml-6 space-y-1">
                <p className="font-medium text-gray-900">{order.customerName}</p>
                <p className="text-sm text-gray-500">{order.email}</p>
                <p className="text-sm text-gray-500">+880 1712-345678</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </div>
              <div className="ml-6 text-sm text-gray-600 leading-relaxed">
                <p>{order.shippingAddress}</p>
                <p>{order.city} - 1205, Bangladesh</p>
              </div>
            </div>

            {/* Shipping Details */}
            {["SHIPPED", "DELIVERED"].includes(order.status) && (
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <Truck className="h-4 w-4" />
                  Shipping Details
                </div>
                <div className="ml-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Courier</span>
                    <span className="font-medium text-gray-900">Pathao Courier</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tracking ID</span>
                    <span className="font-medium text-blue-600 hover:underline cursor-pointer">STE-93847291</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-4">
                Order Summary
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.product}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: 1</p>
                  </div>
                  <span className="font-medium text-sm text-gray-900">{order.amount.toLocaleString()} BDT</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{(order.amount).toLocaleString()} BDT</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charge</span>
                    <span className="font-medium text-gray-900">0 BDT</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="font-medium text-green-600">- 0 BDT</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 border-dashed pt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">Total Amount</span>
                  <span className="font-bold text-blue-600 text-lg">{order.amount.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-4">
                Payment Information
              </div>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900 text-right">bKash</span>
                
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-medium text-gray-900 text-right">8A3F5D7G2H</span>
                
                <span className="text-gray-500">Status</span>
                <span className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Paid</span>
                </span>
                
                <span className="text-gray-500">Amount</span>
                <span className="font-medium text-gray-900 text-right">{order.amount.toLocaleString()} BDT</span>
              </div>
            </div>

            {/* Order Timeline */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-5">
                Order Timeline
              </div>
              <div className="relative pl-3 space-y-6">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />
                
                {[
                  { label: "Order Placed", statusList: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"], time: `${order.date} | 10:30 AM` },
                  { label: "Payment Confirmed", statusList: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"], time: `${order.date} | 10:32 AM` },
                  { label: "Processing", statusList: ["PROCESSING", "SHIPPED", "DELIVERED"], time: `${order.date} | 11:00 AM` },
                  { label: "Shipped", statusList: ["SHIPPED", "DELIVERED"], time: `2026-08-10 | 04:20 PM` },
                  { label: "Delivered", statusList: ["DELIVERED"], time: `2026-08-11 | 11:15 AM` }
                ].map((step, idx) => {
                  const isCompleted = step.statusList.includes(order.status);
                  return (
                    <div key={idx} className="relative flex gap-4">
                      <div className="z-10 bg-white rounded-full">
                        <CheckCircle2 className={`h-5 w-5 ${isCompleted ? 'text-emerald-500 fill-emerald-50' : 'text-gray-300 fill-gray-50'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                        <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>{step.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        {/* Fixed Footer Buttons */}
        <div className="flex-none p-5 bg-white border-t border-gray-100 flex justify-end z-10">
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <Printer className="h-4 w-4" />
            Print Invoice
          </button>
        </div>
      </div>
    </>
  );
}
