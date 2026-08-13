"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { GeneralSettingsComponent } from "./general-settings";
import { OrderSettingsComponent } from "./order-settings";
import { PaymentSettingsComponent } from "./payment-settings";
import { EmailSettingsComponent } from "./email-settings";
import { ShippingSettingsComponent } from "./shipping-settings";
import settingsJson from "@/features/settings/data/settings.json";
import type { Settings } from "@/features/settings/types";

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(settingsJson as Settings);

  const updateGeneral = (general: Settings["general"]) => setSettings({ ...settings, general });
  const updateOrder = (order: Settings["order"]) => setSettings({ ...settings, order });
  const updatePayment = (payment: Settings["payment"]) => setSettings({ ...settings, payment });
  const updateEmail = (email: Settings["email"]) => setSettings({ ...settings, email });
  const updateShipping = (shipping: Settings["shipping"]) => setSettings({ ...settings, shipping });

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
          <TabsTrigger value="email">Email</TabsTrigger>
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
        <TabsContent value="email" className="mt-4">
          <EmailSettingsComponent settings={settings.email} onSave={updateEmail} />
        </TabsContent>
        <TabsContent value="shipping" className="mt-4">
          <ShippingSettingsComponent settings={settings.shipping} onSave={updateShipping} />
        </TabsContent>
      </Tabs>
    </div>
  );
}