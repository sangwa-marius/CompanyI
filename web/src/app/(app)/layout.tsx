"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/companies")) return "Companies";
  if (pathname.startsWith("/employees")) return "Employees";
  if (pathname.startsWith("/departments")) return "Departments";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Dashboard";
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-alt">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}
