"use client";
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import type { Notification } from "@/features/notifications/types";
import { apiRequest } from "@/lib/api";

interface NotificationFormProps {
  isOpen: boolean;
  initialData?: Notification | null;
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

export function NotificationForm({ isOpen, initialData, onClose, onSave }: NotificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "system",
    actionUrl: null as string | null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        message: initialData.message || "",
        type: (initialData.type || "system").toLowerCase(),
        actionUrl: initialData.actionUrl || null,
      });
    } else {
      setFormData({
        title: "",
        message: "",
        type: "system",
        actionUrl: null,
      });
    }
  }, [initialData, isOpen]);

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const typeMap: Record<string, string> = {
        order: "ORDER",
        payment: "PAYMENT",
        shipping: "SHIPPING",
        alert: "ALERT",
        system: "SYSTEM",
      };

      if (initialData) {
        const res = await apiRequest(`/admin/notifications/${initialData.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title: formData.title,
            message: formData.message,
            type: typeMap[formData.type] || "SYSTEM",
          }),
        });
        if (res.success && res.data) {
          onSave(res.data as Notification);
        } else {
          onSave({
            ...initialData,
            title: formData.title,
            message: formData.message,
            type: formData.type as any,
          });
        }
      } else {
        const res = await apiRequest("/admin/notifications", {
          method: "POST",
          body: JSON.stringify({
            title: formData.title,
            message: formData.message,
            type: typeMap[formData.type] || "SYSTEM",
          }),
        });
        if (res.success && res.data) {
          onSave(res.data as Notification);
        } else {
          onSave({
            id: `NOTIF-${Date.now().toString().slice(-3)}`,
            title: formData.title,
            message: formData.message,
            type: formData.type as any,
            time: new Date().toISOString(),
            read: false,
            actionUrl: null,
          });
        }
      }
    } catch {
      if (initialData) {
        onSave({
          ...initialData,
          title: formData.title,
          message: formData.message,
          type: formData.type as any,
        });
      } else {
        onSave({
          id: `NOTIF-${Date.now().toString().slice(-3)}`,
          title: formData.title,
          message: formData.message,
          type: formData.type as any,
          time: new Date().toISOString(),
          read: false,
          actionUrl: null,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>{initialData ? "Edit Notification" : "Send Notification"}</DialogTitle>
        <DialogDescription>
          {initialData
            ? "Update notification content and details."
            : "Create a new system notification for your team."}
        </DialogDescription>
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
                <Textarea
                  value={formData.message}
                  onChange={(e) => update({ message: e.target.value })}
                  rows={3}
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
        <Button type="submit" form="notification-form" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Send Notification"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}