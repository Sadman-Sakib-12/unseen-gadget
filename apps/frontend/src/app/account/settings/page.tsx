"use client";

import { useState } from "react";
import { User, Save, Bell } from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTranslation } from "@/hooks/use-translation";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [name, setName] = useState("Guest User");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newsletter, setNewsletter] = useState(true);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("settings.saved"));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-foreground">{t("settings.title")}</h1>
      </div>

      {/* Profile */}
      <form
        onSubmit={save}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-foreground">
          <User className="h-4 w-4 text-primary" />
          {t("settings.profile")}
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">{t("settings.profileHint")}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">{t("settings.name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">{t("settings.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">{t("settings.phone")}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-5">
          <Save className="h-4 w-4" />
          {t("settings.save")}
        </button>
      </form>

      {/* Preferences */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-bold text-foreground">{t("settings.preferences")}</h3>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{t("settings.language")}</span>
          <LanguageSwitcher />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
          <span className="text-sm font-medium text-foreground">Theme</span>
          <ThemeSwitcher />
        </div>

        <label className="mt-5 flex cursor-pointer items-center justify-between border-t border-border pt-5">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Bell className="h-4 w-4 text-muted-foreground" />
            {t("settings.newsletter")}
          </span>
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
        </label>
      </div>
    </div>
  );
}
