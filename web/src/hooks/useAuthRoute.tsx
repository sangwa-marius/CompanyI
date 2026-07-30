"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function useAuthRoute() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname.startsWith("/auth");
    const isAuthenticated = !!user;

    if (isAuthenticated && isAuthPage) {
      router.replace("/dashboard");
    } else if (!isAuthenticated && !isAuthPage) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, pathname, router]);

  return { user, isLoading, isAuthenticated: !!user };
}
