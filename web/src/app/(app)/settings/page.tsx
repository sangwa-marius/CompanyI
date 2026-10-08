"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme, type ThemePreference } from "@/context/ThemeContext";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { User, Lock, Eye, EyeOff, Monitor, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { preference, resolvedTheme, setPreference } = useTheme();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await api.put("/auth/update-profile", { username, email });
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 404
      ) {
        toast.error("Profile update is not available yet");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 404
      ) {
        toast.error("Password change is not available yet");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.14em] text-primary">Account</p>
        <h1 className="mt-1 text-3xl font-bold tracking-[-.04em] text-[#17251b]">Settings</h1>
        <p className="mt-1 text-muted">Manage your profile and security preferences.</p>
      </div>

      <div className="rounded-2xl border border-[#e0e8e1] bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5"><Monitor className="h-5 w-5 text-primary" /></div>
          <div><h2 className="text-lg font-bold tracking-tight text-[#17251b]">Appearance</h2><p className="text-sm text-muted">Choose how CompanyI looks on this device.</p></div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {([
            { value: "system", label: "System", description: "Match your device", icon: Monitor },
            { value: "light", label: "Light", description: "Always use light", icon: Sun },
            { value: "dark", label: "Dark", description: "Always use dark", icon: Moon },
          ] as const).map((option) => {
            const Icon = option.icon;
            const isSelected = preference === option.value;
            return <button key={option.value} type="button" onClick={() => setPreference(option.value as ThemePreference)} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-[#e1e8e2] hover:border-primary/35 hover:bg-[#f8fbf8]"}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${isSelected ? "bg-primary text-white" : "bg-[#f1f6f1] text-primary"}`}><Icon className="h-4 w-4" /></span><span><span className="block text-sm font-semibold text-[#26362a]">{option.label}</span><span className="mt-0.5 block text-xs text-muted">{option.description}</span></span></button>;
          })}
        </div>
        <p className="mt-4 text-xs text-muted">Currently using <span className="font-semibold text-primary">{resolvedTheme}</span> mode.</p>
      </div>

      <div className="rounded-2xl border border-[#e0e8e1] bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#17251b]">Profile information</h2>
            <p className="text-sm text-muted">Update your account details</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
               className="w-full rounded-xl border border-[#e1e8e2] bg-[#fbfdfb] px-4 py-2.5 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               className="w-full rounded-xl border border-[#e1e8e2] bg-[#fbfdfb] px-4 py-2.5 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-[#e0e8e1] bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#17251b]">Change password</h2>
            <p className="text-sm text-muted">Update your password to keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                 className="w-full rounded-xl border border-[#e1e8e2] bg-[#fbfdfb] px-4 py-2.5 pr-10 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                 className="w-full rounded-xl border border-[#e1e8e2] bg-[#fbfdfb] px-4 py-2.5 pr-10 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                 className="w-full rounded-xl border border-[#e1e8e2] bg-[#fbfdfb] px-4 py-2.5 pr-10 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
