"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Notification } from "@/features/notifications/types";

interface NotificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notification: Notification) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function NotificationForm({ isOpen, onClose, onSave }: NotificationFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    message: "",
    type: "system",
    time: "",
    read: false,
    actionUrl: null as string | null,
  });

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({
      ...formData,
      id: `NOTIF-${Date.now().toString().slice(-3)}`,
      time: new Date().toISOString(),
      actionUrl: null,
    } as Notification);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogDescription>Create a new system notification for your team.</DialogDescription>
      </DialogHeader>
      <DialogContent>
        <form id="notification-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="e.g. New order received"
                required
              />
            </Field>
            <Field label="Type">
              <Select
                value={formData.type}
                onChange={(e) => update({ type: e.target.value })}
                options={[
                  { value: "order", label: "Order" },
                  { value: "payment", label: "Payment" },
                  { value: "shipping", label: "Shipping" },
                  { value: "alert", label: "Alert" },
                  { value: "system", label: "System" },
                ]}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Message">
                <textarea
                  value={formData.message}
                  onChange={(e) => update({ message: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Notification message body"
                  required
                />
              </Field>
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="notification-form">
          Send Notification
        </Button>
      </DialogFooter>
    </Dialog>
  );
}