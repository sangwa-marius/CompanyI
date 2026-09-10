"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import {
  ArrowRight,
  Building2,
  Users,
  FolderTree,
  Briefcase,
  Shield,
  Globe2,
  Check,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";
import { publicApi } from "@/lib/api";

interface LandingStats {
  totalCompanies: number;
  totalEmployees: number;
  totalDepartments: number;
  totalProjects: number;
  totalUsers: number;
  activeCompanies: number;
}

interface DashboardPreview {
  companies: number;
  employees: number;
  departments: number;
  projects: number;
  activeProjects: number;
  recentProjects: Array<{ name: string; status: string; manager: string }>;
}

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<LandingStats | null>(null);
  const [preview, setPreview] = useState<DashboardPreview | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (user) router.replace("/dashboard");
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, previewRes] = await Promise.all([
          publicApi.get("/public/stats"),
          publicApi.get("/public/dashboard-preview")
        ]);
        setStats(statsRes.data);
        setPreview(previewRes.data);
      } catch (error) {
        console.error("Failed to fetch landing data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <Hero />
        <TrustBar stats={stats} />
        <Features />
        <HowItWorks />
        <Stats stats={stats} />
        <DashboardPreview preview={preview} loadingData={loadingData} />
        <Pricing />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/[.06] bg-[#fbfdfb]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between">
          <BrandLogo />

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              How it works
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Testimonials
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-primary/30"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbfdfb]">
      <div className="noise-grid absolute inset-0" />
      <div className="absolute -right-40 top-[-11rem] h-[35rem] w-[35rem] rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -bottom-48 -left-20 h-[28rem] w-[28rem] rounded-full bg-lime-100/50 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: "easeOut" }} className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Now available for teams of all sizes
            </span>

            <h1 className="max-w-xl text-5xl font-bold tracking-[-.055em] text-[#132219] sm:text-6xl lg:text-7xl">
              Run your company with <span className="relative whitespace-nowrap text-primary">clarity<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 180 12" fill="none"><path d="M3 8.5C45 1.5 122 2 177 6" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" /></svg></span>.
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-[#5e6c62]">
              <span className="font-brand text-primary">CompanyI</span> brings together
              companies, employees, departments, and projects into a unified
              workspace. Make faster decisions, keep teams aligned, and grow
              with clarity.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:bg-primary-dark"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-950/10 bg-white/80 px-6 py-3.5 font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white"
              >
                Explore features
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#5e6c62]">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Free plan available
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Setup in minutes
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .96, x: 18 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .75, delay: .15, ease: "easeOut" }} className="relative">
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -top-10 -left-7 h-40 w-40 rounded-full border border-primary/20" />
              <div className="absolute -bottom-8 -right-5 h-52 w-52 rounded-full border border-primary/15" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white p-3 shadow-[0_28px_70px_-28px_rgba(15,61,31,.35)]">
                <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
                <div className="overflow-hidden rounded-[20px] border border-[#dce7de] bg-[#f7faf7]">
                  <div className="flex h-11 items-center gap-2 border-b border-[#e1e9e2] bg-white px-4"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-300" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div><div className="ml-3 h-5 flex-1 max-w-[170px] rounded-full bg-[#f1f5f1]" /></div>
                <div className="flex min-h-[340px]">
                  <div className="hidden w-16 flex-col items-center gap-5 bg-[#123321] py-5 sm:flex"><BrandLogo compact light className="scale-[.72]" /><span className="h-7 w-7 rounded-lg bg-white/15" /><span className="h-7 w-7 rounded-lg bg-white/5" /><span className="h-7 w-7 rounded-lg bg-white/5" /></div>
                  <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-primary">OVERVIEW</p><h3 className="mt-1 text-xl font-bold tracking-tight text-[#17251b]">Good morning, Alex</h3></div><span className="rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">LIVE</span></div>
                    <div className="mt-5 grid grid-cols-3 gap-3">{["Companies", "People", "Projects"].map((label, i) => <div key={label} className="rounded-xl border border-[#e1e9e2] bg-white p-3"><div className="h-2 w-10 rounded bg-[#dbe8dd]" /><p className="mt-2 text-lg font-bold text-[#17251b]">{["24", "318", "47"][i]}</p><div className="mt-1 h-1.5 w-8 rounded bg-emerald-200" /></div>)}</div>
                    <div className="mt-4 rounded-xl border border-[#e1e9e2] bg-white p-4"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#26362a]">Team growth</p><TrendingUp className="h-4 w-4 text-primary" /></div><svg viewBox="0 0 300 86" className="mt-3 h-24 w-full" fill="none"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#22c55e" stopOpacity=".25"/><stop offset="1" stopColor="#22c55e" stopOpacity="0"/></linearGradient></defs><path d="M2 72C30 68 31 57 55 61C79 65 81 35 106 42C128 48 143 51 162 35C182 18 193 39 216 30C238 21 247 6 298 12V84H2Z" fill="url(#chartFill)"/><path d="M2 72C30 68 31 57 55 61C79 65 81 35 106 42C128 48 143 51 162 35C182 18 193 39 216 30C238 21 247 6 298 12" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/></svg></div>
                  </div>
                </div>
                </div>
              </div>
              <div className="animate-float absolute -right-5 top-20 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-panel"><div className="flex items-center gap-2"><span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white"><span className="animate-pulse-ring absolute inset-0 rounded-full border border-primary" /><Check className="h-4 w-4" /></span><div><p className="text-[10px] text-muted">Project updated</p><p className="text-xs font-bold text-[#17251b]">Website refresh</p></div></div></div>
              <div className="animate-float-delayed absolute -bottom-3 left-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-panel"><p className="text-[10px] font-medium text-muted">Team velocity</p><p className="mt-0.5 text-lg font-bold text-primary">+24.8%</p></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustBar({ stats }: { stats: LandingStats | null }) {
  const trustItems = stats
    ? [
        `${stats.totalCompanies}+ companies`,
        `${stats.totalEmployees}+ employees managed`,
        `${stats.totalProjects}+ projects tracked`
      ]
    : ['Loading...'];

  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-gray-400 mb-6">
          Trusted by modern companies to manage people and work
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {trustItems.map((name) => (
            <span key={name} className="text-base font-semibold text-gray-600">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Building2,
      title: "Company management",
      description:
        "Register and manage companies with full control. Track details, ownership, and status across your entire portfolio.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Users,
      title: "Employee directory",
      description:
        "Maintain rich employee profiles across companies. Assign roles, departments, and track hires in one place.",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: FolderTree,
      title: "Department structure",
      description:
        "Organize teams with clear departments. Assign managers and keep members synced automatically.",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: Briefcase,
      title: "Project tracking",
      description:
        "Run projects end-to-end. Assign managers, attach members, and follow status from planned to completed.",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Shield,
      title: "Secure by default",
      description:
        "Built-in authentication and company-scoped access keep your data protected and your teams productive.",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: Globe2,
      title: "One unified platform",
      description:
        'Stop juggling spreadsheets and disconnected tools. Every company, employee, and project lives in <span className="font-brand">CompanyI</span>.',
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Features</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Everything you need to manage your organization
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From company setup to project delivery,{" "}
            <span className="font-brand text-primary">CompanyI</span> gives you a complete
            toolset designed for real teams.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-xl hover:border-primary/10"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} ${feature.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p
                  className="mt-3 text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create your company",
      description:
        "Register your company in seconds. Invite team members and get your workspace ready.",
    },
    {
      number: "02",
      title: "Add employees and departments",
      description:
        "Build your org structure. Assign departments, set managers, and keep people organized.",
    },
    {
      number: "03",
      title: "Launch projects",
      description:
        "Create projects, assign managers, add members, and track progress from planning to completion.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-t border-gray-100 bg-white py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">How it works</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Get started in minutes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A simple workflow designed to help you move from setup to execution
            without friction.
          </p>
        </div>

        <div className="mt-16 relative hidden md:block" style={{ height: "480px" }}>
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 1200 480" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#166534" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#166534" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#166534" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d="M 600 120 C 450 280, 300 280, 200 360"
                fill="none"
                stroke="url(#linkGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                className="animate-dash"
              />
              <path
                d="M 200 360 C 400 440, 800 440, 1000 360"
                fill="none"
                stroke="url(#linkGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                className="animate-dash"
              />
            </svg>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 animate-fade-in-up" style={{ animationDelay: "0s" }}>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-500 group">
              <span className="text-3xl font-bold text-primary/10 absolute top-4 right-6 group-hover:scale-110 transition-transform">
                01
              </span>
              <div className="relative">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Step 01
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  Create your company
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  Register your company in seconds. Invite team members and get your workspace ready.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-[8%] w-80 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-500 group">
              <span className="text-3xl font-bold text-primary/10 absolute top-4 right-6 group-hover:scale-110 transition-transform">
                02
              </span>
              <div className="relative">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Step 02
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  Add employees and departments
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  Build your org structure. Assign departments, set managers, and keep people organized.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-[8%] w-80 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-500 group">
              <span className="text-3xl font-bold text-primary/10 absolute top-4 right-6 group-hover:scale-110 transition-transform">
                03
              </span>
              <div className="relative">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Step 03
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  Launch projects
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  Create projects, assign managers, add members, and track progress from planning to completion.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:hidden">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <span className="text-3xl font-bold text-primary/10 absolute top-4 right-6 group-hover:scale-110 transition-transform">
                {step.number}
              </span>
              <div className="relative">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Step {step.number}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ stats }: { stats: LandingStats | null }) {
  const items = stats
    ? [
        { value: `${stats.totalUsers}+`, label: "Active users" },
        { value: `${stats.totalCompanies}+`, label: "Companies" },
        { value: `${stats.activeCompanies}+`, label: "Active companies" },
        { value: `${stats.totalProjects}+`, label: "Projects tracked" },
      ]
    : [
        { value: "...", label: "Active users" },
        { value: "...", label: "Companies" },
        { value: "...", label: "Active companies" },
        { value: "...", label: "Projects tracked" },
      ];

  return (
    <section className="border-t border-gray-100 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 text-center md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-4xl font-bold text-gray-900">{item.value}</p>
              <p className="mt-2 text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview({ preview, loadingData }: { preview: DashboardPreview | null; loadingData: boolean }) {
  return (
    <section className="border-t border-gray-100 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Live preview</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            See CompanyI in action
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A real workspace showing companies, employees, departments, and projects managed on the platform.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <p className="text-xs text-gray-400">Demo workspace</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { label: "Companies", value: loadingData ? "..." : String(preview?.companies ?? 0) },
              { label: "Employees", value: loadingData ? "..." : String(preview?.employees ?? 0) },
              { label: "Departments", value: loadingData ? "..." : String(preview?.departments ?? 0) },
              { label: "Projects", value: loadingData ? "..." : String(preview?.projects ?? 0) },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
              >
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent projects</p>
            <div className="space-y-2">
              {loadingData ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : (
                preview?.recentProjects?.map((project, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{project.name}</p>
                      <p className="text-xs text-gray-500">Status: {project.status}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      project.status === 'ONGOING' ? 'bg-blue-50 text-blue-600' :
                      project.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals and small teams getting started.",
      features: [
        "1 company",
        "10 employees",
        "5 departments",
        "5 projects",
        "Basic support",
      ],
      cta: "Start for free",
      href: "/auth/register",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For growing teams that need more power and flexibility.",
      features: [
        "Unlimited companies",
        "Unlimited employees",
        "Unlimited departments",
        "Unlimited projects",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
      ],
      cta: "Get started",
      href: "/auth/register",
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="border-t border-gray-100 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Pricing</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free and upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular
                  ? "border-primary shadow-xl"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                    <Sparkles className="h-3 w-3" />
                    Most popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">/{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-gray-100 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Loved by teams everywhere
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                '<span className="font-brand">CompanyI</span> replaced three separate tools for us. Having employees, departments, and projects in one place is a game changer.',
              author: "Sarah Chen",
              role: "Head of Operations, Meridian",
            },
            {
              quote:
                "The clean UI and fast onboarding meant our managers were productive from day one.",
              author: "Daniel Okonjo",
              role: "CTO, NovaBridge",
            },
            {
              quote:
                "We finally have a single source of truth for company structure. Setup took less than an hour.",
              author: "Elena Ruiz",
              role: "HR Director, Altura",
            },
          ].map((item) => (
            <div
              key={item.author}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: `"${item.quote}"` }} />
              </p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-900">
                  {item.author}
                </p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="border-t border-gray-100 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center bg-gray-50 rounded-3xl p-12 border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Ready to organize your company?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free today. No credit card required. Upgrade when you need more.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-white font-medium hover:bg-primary-dark transition-colors shadow-sm"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-8 py-3.5 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-base font-brand font-semibold text-primary">
              CompanyI
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-brand">CompanyI</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
