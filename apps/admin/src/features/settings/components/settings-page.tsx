"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { GeneralSettingsComponent } from "./general-settings";
import { OrderSettingsComponent } from "./order-settings";
import { PaymentSettingsComponent } from "./payment-settings";
import { ShippingSettingsComponent } from "./shipping-settings";
import { apiRequest } from "@/lib/api";
import { Settings } from "@/features/settings/types";

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(() => ({
    general: {
      storeName: "",
      storeEmail: "",
      storePhone: "",
      storeAddress: "",
      currency: "",
      timezone: "",
      language: "",
      logo: null,
      favicon: null,
    },
    order: {
      autoConfirmOrders: false,
      allowCancellation: false,
      cancellationWindowHours: 24,
      requireShippingAddress: true,
      minimumOrderAmount: 0,
      orderPrefix: "",
    },
    payment: {
      acceptCashOnDelivery: true,
      acceptCardPayments: false,
      acceptBankTransfer: false,
      acceptMobileBanking: true,
      bkashNumber: "",
      nagadNumber: "",
      rocketNumber: "",
      currency: "BDT",
      taxRate: 0,
      taxIncluded: false,
    },
    email: {
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      senderEmail: "",
      senderName: "",
      sendOrderConfirmation: true,
      sendShippingUpdate: true,
      sendMarketingEmails: false,
    },
    shipping: {
      freeShippingThreshold: 0,
      defaultShippingCost: 0,
      expressShippingCost: 0,
      shippingZones: [],
      estimatedDeliveryDays: { standard: 5, express: 2 },
    },
  }));

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiRequest("/admin/settings", { credentials: "include" });
        if (res.success && res.data) {
          setSettings(res.data as Settings);
        }
      } catch (e: unknown) {
        console.error("Failed to fetch settings:", e);
      }
    };
    fetchSettings();
  }, []);

  const updateGeneral = async (general: Settings["general"]) => {
    setSettings((prev) => ({ ...prev, general }));
    try {
      await apiRequest("/admin/settings/general", {
        method: "PUT",
        body: JSON.stringify({ value: general }),
      });
    } catch (e: unknown) {
      console.error("Failed to save general settings:", e);
    }
  };

  const updateOrder = async (order: Settings["order"]) => {
    setSettings((prev) => ({ ...prev, order }));
    try {
      await apiRequest("/admin/settings/order", {
        method: "PUT",
        body: JSON.stringify({ value: order }),
      });
    } catch (e: unknown) {
      console.error("Failed to save order settings:", e);
    }
  };

  const updatePayment = async (payment: Settings["payment"]) => {
    setSettings((prev) => ({ ...prev, payment }));
    try {
      await apiRequest("/admin/settings/payment", {
        method: "PUT",
        body: JSON.stringify({ value: payment }),
      });
    } catch (e: unknown) {
      console.error("Failed to save payment settings:", e);
    }
  };

  const updateShipping = async (shipping: Settings["shipping"]) => {
    setSettings((prev) => ({ ...prev, shipping }));
    try {
      await apiRequest("/admin/settings/shipping", {
        method: "PUT",
        body: JSON.stringify({ value: shipping }),
      });
    } catch (e: unknown) {
      console.error("Failed to save shipping settings:", e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your store preferences"
      />
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="order">Orders</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4">
          <GeneralSettingsComponent settings={settings.general} onSave={updateGeneral} />
        </TabsContent>
        <TabsContent value="order" className="mt-4">
          <OrderSettingsComponent settings={settings.order} onSave={updateOrder} />
        </TabsContent>
        <TabsContent value="payment" className="mt-4">
          <PaymentSettingsComponent settings={settings.payment} onSave={updatePayment} />
        </TabsContent>
        <TabsContent value="shipping" className="mt-4">
          <ShippingSettingsComponent settings={settings.shipping} onSave={updateShipping} />
        </TabsContent>
      </Tabs>
    </div>
  );
}