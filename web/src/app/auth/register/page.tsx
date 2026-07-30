"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Building2 } from "lucide-react";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
    title: "Manage your company",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80",
    title: "Organize teams",
  },
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80",
    title: "Track projects",
  },
];

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [current, setCurrent] = useState(0);
  const { register, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      await register(username, email, password);
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-sm text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: idx === current ? 1 : 0,
          }}
        >
          <img
            src={slide.src}
            alt=""
            className="h-full w-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/60" />
        </div>
      ))}

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-brand text-white">Companyi</h1>
            <p className="mt-2 text-sm text-gray-300">
              {SLIDES[current]?.title}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                placeholder="Username"
              />
            </div>

            <div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                placeholder="Email"
              />
            </div>

            <div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 pr-10 text-sm text-white placeholder-gray-400 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 pr-10 text-sm text-white placeholder-gray-400 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-400">
            <span>Have an account? </span>
            <Link href="/auth/login" className="text-white font-medium hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === current ? "w-6 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
