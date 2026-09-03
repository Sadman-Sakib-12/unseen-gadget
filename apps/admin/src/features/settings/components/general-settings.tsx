"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { CheckCircle2, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/ui/utils";
import { toast } from "sonner";
import type { GeneralSettings } from "@/features/settings/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface GeneralSettingsProps {
  settings: GeneralSettings;
  onSave: (settings: GeneralSettings) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function GeneralSettingsComponent({ settings, onSave }: GeneralSettingsProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: {} } = useForm<GeneralSettings>({
    defaultValues: settings,
  });
  const [saved, setSaved] = useState(false);
  const logo = watch('logo');
  const favicon = watch('favicon');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);



  // Synchronize form values with incoming settings once fetched
  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const handleLogoUpload = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setUploadingLogo(true);
    try {
      const data = new FormData();
      data.append("file", files[0]);

      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: "POST",
        credentials: "include",
        body: data,
      });
      const json = await res.json();
      if (json.success && json.data?.url) {
        setValue("logo", json.data.url);
        toast.success("Logo uploaded successfully");
      } else {
        toast.error(json.error || json.message || "Failed to upload logo");
      }
    } catch (e: unknown) {
      const err = e as Error;
      toast.error(err.message || "Logo upload failed");
    } finally {
      setUploadingLogo(false);
      if (logoFileRef.current) logoFileRef.current.value = "";
    }
  };

  const handleFaviconUpload = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setUploadingFavicon(true);
    try {
      const data = new FormData();
      data.append("file", files[0]);

      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: "POST",
        credentials: "include",
        body: data,
      });
      const json = await res.json();
      if (json.success && json.data?.url) {
        setValue("favicon", json.data.url);
        toast.success("Favicon uploaded successfully");
      } else {
        toast.error(json.error || json.message || "Failed to upload favicon");
      }
    } catch (e: unknown) {
      const err = e as Error;
      toast.error(err.message || "Favicon upload failed");
    } finally {
      setUploadingFavicon(false);
      if (faviconFileRef.current) faviconFileRef.current.value = "";
    }
  };

  const onSubmit = (data: GeneralSettings) => {
    onSave(data);
    setSaved(true);
    toast.success("General settings saved successfully!");
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="general-settings" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Store Name">
              <Input
                type="text"
                {...register('storeName')}
              />
            </Field>
            <Field label="Store Email">
              <Input
                type="email"
                {...register('storeEmail')}
              />
            </Field>
            <Field label="Phone">
              <Input
                type="text"
                {...register('storePhone')}
              />
            </Field>
            <Field label="Currency">
              <Select
                {...register('currency')}
                options={[
                  { value: "BDT", label: "BDT (৳)" },
                  { value: "USD", label: "USD ($)" },
                  { value: "INR", label: "INR (₹)" },
                ]}
              />
            </Field>
            <Field label="Timezone">
              <Select
                {...register('timezone')}
                options={[
                  { value: "Asia/Dhaka", label: "Asia/Dhaka" },
                  { value: "Asia/Kolkata", label: "Asia/Kolkata" },
                  { value: "UTC", label: "UTC" },
                ]}
              />
            </Field>
            <Field label="Language">
              <Select
                {...register('language')}
                options={[
                  { value: "en", label: "English" },
                  { value: "bn", label: "Bengali" },
                ]}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Address">
                <Textarea
                  {...register('storeAddress')}
                  rows={2}
                />
              </Field>
            </div>

            {/* Logo field */}
            <div className="space-y-2">
              <Field label="Store Logo">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="https://... or /logo.png"
                    {...register('logo')}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoFileRef}
                    onChange={(e) => handleLogoUpload(e.target.files)}
                    style={{ display: "none" }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingLogo}
                    onClick={() => logoFileRef.current?.click()}
                    className="shrink-0"
                  >
                    {uploadingLogo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload
                  </Button>
                </div>
                {logo ? (
                  <div className="mt-2 flex items-center justify-between rounded-lg border border-border p-2 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Image src={logo!} alt="Logo Preview" width={140} height={40} className="h-8 max-w-[140px] object-contain" />
                      <span className="text-xs text-muted-foreground">Logo Preview</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 h-7"
                      onClick={() => setValue('logo', null)}
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                ) : null}
              </Field>
            </div>

            {/* Favicon field */}
            <div className="space-y-2">
              <Field label="Favicon">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="https://... or /favicon.ico"
                    {...register('favicon')}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={faviconFileRef}
                    onChange={(e) => handleFaviconUpload(e.target.files)}
                    style={{ display: "none" }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingFavicon}
                    onClick={() => faviconFileRef.current?.click()}
                    className="shrink-0"
                  >
                    {uploadingFavicon ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload
                  </Button>
                </div>
                {favicon ? (
                  <div className="mt-2 flex items-center justify-between rounded-lg border border-border p-2 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Image src={favicon!} alt="Favicon Preview" width={24} height={24} className="h-6 w-6 object-contain" />
                      <span className="text-xs text-muted-foreground">Favicon Preview</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 h-7"
                      onClick={() => setValue('favicon', null)}
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                ) : null}
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 transition-opacity",
                saved ? "opacity-100" : "opacity-0"
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              Settings saved
            </span>
            <Button type="submit" className="min-w-[120px]">Save Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}