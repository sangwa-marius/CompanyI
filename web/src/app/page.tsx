"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  Building2,
  Users,
  FolderTree,
  Briefcase,
  Shield,
  Zap,
  Globe2,
  BarChart3,
} from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) router.replace("/dashboard");
  }, [isLoading, user, router]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Cta />
      </main>

      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-brand text-primary">Companyi</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-primary"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-primary"
            >
              How it works
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-gray-600 hover:text-primary"
            >
              Testimonials
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-primary hover:bg-gray-100"
            >
              Create your account
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
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background-alt to-secondary/5" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Zap className="h-3.5 w-3.5" />
              Now available for teams of all sizes
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Organize your entire company
              <span className="block text-primary">in one place</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              <span className="font-brand">Companyi</span> brings together
              companies, employees, departments, and projects into a unified
              workspace. Make faster decisions, keep teams aligned, and grow
              with clarity.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-gray-700 font-medium hover:bg-gray-50"
              >
                Explore features
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              No credit card required. Free plan available.
            </p>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -top-6 -left-6 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-6 -right-6 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
              <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <p className="text-xs text-gray-400">Companyi dashboard</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Companies", value: "12" },
                    { label: "Employees", value: "384" },
                    { label: "Departments", value: "48" },
                    { label: "Projects", value: "16" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-gray-100 bg-gray-50/50 p-3"
                    >
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Active projects</p>
                      <p className="text-sm font-semibold text-gray-900">
                        9 ongoing
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-3 flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div
                        key={i}
                        className="h-8 flex-1 rounded-md bg-primary/80"
                        style={{ opacity: 0.4 + i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-b border-gray-100 bg-gray-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-gray-400">
          Trusted by modern companies to manage people and work
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60 grayscale">
          {["Acme Corp", "Globex", "Initech", "Umbrella", "Stark"].map(
            (name) => (
              <span key={name} className="text-lg font-semibold text-gray-600">
                {name}
              </span>
            ),
          )}
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
    },
    {
      icon: Users,
      title: "Employee directory",
      description:
        "Maintain rich employee profiles across companies. Assign roles, departments, and track hires in one place.",
    },
    {
      icon: FolderTree,
      title: "Department structure",
      description:
        "Organize teams with clear departments. Assign managers and keep members synced automatically.",
    },
    {
      icon: Briefcase,
      title: "Project tracking",
      description:
        "Run projects end-to-end. Assign managers, attach members, and follow status from planned to completed.",
    },
    {
      icon: Shield,
      title: "Secure by default",
      description:
        "Built-in authentication and company-scoped access keep your data protected and your teams productive.",
    },
    {
      icon: Globe2,
      title: "One unified platform",
      description:
        'Stop juggling spreadsheets and disconnected tools. Every company, employee, and project lives in <span className="font-brand">Companyi</span>.',
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Everything you need to manage your organization
          </h2>
          <p className="mt-3 text-gray-600">
            From company setup to project delivery,{" "}
            <span className="font-brand">Companyi</span> gives you a complete
            toolset designed for real teams.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p
                  className="mt-2 text-sm text-gray-600 leading-relaxed"
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
      className="border-t border-gray-100 bg-gray-50/60/30 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Get started in minutes
          </h2>
          <p className="mt-3 text-gray-600">
            A simple workflow designed to help you move from setup to execution
            without friction.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className="text-xs font-semibold text-primary">
                {step.number}
              </span>
              <h3 className="mt-2 text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: "10k+", label: "Active users" },
    { value: "500+", label: "Companies" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support ready" },
  ];

  return (
    <section className="border-t border-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 text-center md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className="mt-1 text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-gray-100 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Loved by teams everywhere
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              quote:
                '<span className="font-brand">Companyi</span> replaced three separate tools for us. Having employees, departments, and projects in one place is a game changer.',
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
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-gray-700 leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: `"${item.quote}"` }} />
              </p>
              <div className="mt-5">
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
    <section className="border-t border-gray-100 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-white">
              Ready to organize your company?
            </h2>
            <p className="mt-2 text-white/80">
              Start free today. No credit card required.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-primary hover:bg-gray-100"
          >
            Create your account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-base font-brand font-semibold text-primary">
            Companyi
          </span>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-brand">Companyi</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
