"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

type ErrorState = "idle" | "invalid" | "expired" | "used";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState<ErrorState>("idle");

  useEffect(() => {
    if (!token || !email) {
      setErrorState("invalid");
    }
  }, [token, email]);

  const getErrorMessage = (message: string): ErrorState => {
    const lower = message.toLowerCase();
    if (lower.includes("expired")) return "expired";
    if (lower.includes("already used")) return "used";
    return "invalid";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      setErrorState("invalid");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post(`/auth/reset-password?token=${token}&email=${email}`, { password });
      toast.success("Password reset successfully");
      window.location.href = "/auth/login";
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to reset password";
      setErrorState(getErrorMessage(message));
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (errorState !== "idle") {
    const config = {
      invalid: {
        title: "Invalid Link",
        description: "This password reset link is invalid or malformed.",
        cta: "Request a new link",
        ctaHref: "/auth/forgot-password",
      },
      expired: {
        title: "Link Expired",
        description: "This password reset link has expired. For your security, links are only valid for 10 minutes.",
        cta: "Request a new link",
        ctaHref: "/auth/forgot-password",
      },
      used: {
        title: "Link Already Used",
        description: "This password reset link has already been used. If you need to reset your password again, please request a new link.",
        cta: "Request a new link",
        ctaHref: "/auth/forgot-password",
      },
    }[errorState];

    return (
      <div className="flex min-h-screen items-center justify-center bg-background-alt px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text">{config.title}</h1>
          <p className="mt-4 text-muted">{config.description}</p>
          <Link
            href={config.ctaHref}
            className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-white font-medium hover:bg-secondary transition-colors"
          >
            {config.cta}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-alt px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text">Reset password</h1>
          <p className="mt-2 text-muted">
            Enter your new password below
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text"
            >
              New Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-border px-3 py-2 bg-white text-text shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-text"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border border-border px-3 py-2 bg-white text-text shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Repeat your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary px-4 py-2 text-white font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-muted">
          <Link href="/auth/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
