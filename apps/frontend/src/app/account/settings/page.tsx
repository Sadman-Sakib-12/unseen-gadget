"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import { User, Save, Bell, Lock } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
    }
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await apiRequest("/auth/me");
        if (res.success && res.data) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
          setPhone(res.data.phone || "");
        }
      } catch (e: any) {
        // Fallback to session data if /auth/me fails
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [status, session]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, email, phone }),
      });
      toast.success(t("settings.saved") || "Profile updated successfully!");
    } catch (e: any) {
      toast.error(e?.error || e?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully!");
    } catch (e: any) {
      toast.error(e?.error || e?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-foreground">{t("settings.title")}</h1>
      </div>

      {/* Profile */}
      <form
        onSubmit={saveProfile}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-foreground">
          <User className="h-4 w-4 text-primary" />
          {t("settings.profile")}
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">{t("settings.profileHint")}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              {t("settings.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              {t("settings.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              {t("settings.phone")}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-5" disabled={loading}>
          <Save className="h-4 w-4" />
          {t("settings.save")}
        </button>
      </form>

      {/* Password */}
      <form
        onSubmit={savePassword}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-foreground">
          <Lock className="h-4 w-4 text-primary" />
          Change Password
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">Leave blank to keep current password.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-foreground">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-5" disabled={loading}>
          <Save className="h-4 w-4" />
          Update Password
        </button>
      </form>

      {/* Preferences */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-bold text-foreground">
          {t("settings.preferences")}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {t("settings.language")}
          </span>
          <LanguageSwitcher />
        </div>

        <div className="mt-5 flex items-center justify-between">
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
