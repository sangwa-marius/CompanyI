"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Users,
  FolderTree,
  Briefcase,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  CheckCheck,
  Command,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/BrandLogo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/departments", label: "Departments", icon: FolderTree },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
  title = "Dashboard",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const searchResults = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openWorkspacePage = (href: string) => {
    router.push(href);
    setSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7f5]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#102015]/55 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[276px] flex-col border-r border-[#e2e9e3] bg-white text-[#17251b] shadow-xl shadow-emerald-950/[.05] transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-[#edf1ed] px-6">
          <BrandLogo />
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-muted hover:bg-[#f4f8f4] hover:text-primary lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#849087]">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-[#68756c] hover:bg-[#f1f7f2] hover:text-primary"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] ${isActive ? "text-white" : "text-[#819087] group-hover:text-primary"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-[#edf1ed] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#f4f8f4] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {user?.username?.slice(0, 1).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#26362a]">{user?.username}</p>
              <p className="truncate text-xs text-[#78857c]">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = "/auth/login";
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#b44b4b] transition-colors hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-[#e4ebe5] bg-[#f8faf8]/90 px-4 backdrop-blur-xl lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 rounded-lg p-2 text-muted hover:bg-white hover:text-text lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="hidden text-[10px] font-bold uppercase tracking-[.14em] text-primary/70 sm:block">CompanyI workspace</p>
            <h1 className="truncate text-lg font-bold tracking-tight text-[#17251b]">{title}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} aria-label="Search workspace" className="hidden h-10 items-center gap-2 rounded-xl border border-[#e1e8e2] bg-white px-3 text-xs text-muted shadow-sm transition hover:border-primary/30 md:flex">
              <Search className="h-4 w-4" /> <span>Search</span><kbd className="ml-5 rounded border border-gray-100 px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
            </button>
            <button onClick={() => setSearchOpen(true)} aria-label="Search workspace" className="grid h-10 w-10 place-items-center rounded-xl border border-[#e1e8e2] bg-white text-muted shadow-sm transition hover:text-primary md:hidden"><Search className="h-[18px] w-[18px]" /></button>
            <div className="relative">
              <button onClick={() => setNotificationsOpen((open) => !open)} aria-label="Notifications" aria-expanded={notificationsOpen} className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#e1e8e2] bg-white text-muted shadow-sm transition hover:text-primary"><Bell className="h-[18px] w-[18px]" />{hasUnreadNotifications && <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-white" />}</button>
              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-[#e1e8e2] bg-white shadow-xl shadow-emerald-950/10">
                  <div className="flex items-center justify-between border-b border-[#edf1ed] px-4 py-3"><div><p className="text-sm font-bold text-[#17251b]">Notifications</p><p className="text-[11px] text-muted">Workspace updates</p></div><button onClick={() => setHasUnreadNotifications(false)} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"><CheckCheck className="h-4 w-4" />Mark read</button></div>
                  <div className="p-2"><div className="rounded-xl bg-[#f5f9f5] p-3"><div className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" /><div><p className="text-sm font-semibold text-[#26362a]">Your workspace is ready</p><p className="mt-1 text-xs leading-relaxed text-muted">Use the dashboard to monitor companies, people, departments, and projects.</p><button onClick={() => { setNotificationsOpen(false); router.push("/dashboard"); }} className="mt-2 text-xs font-semibold text-primary hover:underline">Open dashboard</button></div></div></div></div>
                  <div className="border-t border-[#edf1ed] px-4 py-2.5 text-center text-[11px] text-muted">Notifications will appear here as activity is added.</div>
                </div>
              )}
            </div>
            <button className="hidden items-center gap-1 rounded-xl px-2 py-2 text-muted hover:bg-white sm:flex"><ChevronDown className="h-4 w-4" /></button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-[#102015]/30 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={() => setSearchOpen(false)}>
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#dce6de] bg-white shadow-2xl shadow-emerald-950/15" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-[#e8eee8] px-4"><Search className="h-5 w-5 text-primary" /><input ref={searchInputRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && searchResults[0]) openWorkspacePage(searchResults[0].href); }} placeholder="Search workspace pages..." className="h-14 min-w-0 flex-1 bg-transparent text-sm text-[#17251b] outline-none placeholder:text-[#9aa69d]" /><kbd className="rounded border border-[#e1e8e2] px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd></div>
            <div className="p-2"><p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#849087]">Navigate to</p>{searchResults.length ? searchResults.map((item) => { const Icon = item.icon; return <button key={item.href} onClick={() => openWorkspacePage(item.href)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#354439] transition-colors hover:bg-[#f1f7f2] hover:text-primary"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span><span className="font-medium">{item.label}</span><span className="ml-auto text-xs text-muted">Go to</span></button>; }) : <p className="px-3 py-8 text-center text-sm text-muted">No workspace page found.</p>}</div>
            <div className="flex items-center gap-2 border-t border-[#edf1ed] px-4 py-2.5 text-[11px] text-muted"><Command className="h-3.5 w-3.5" />Press <strong className="font-semibold text-[#556258]">Enter</strong> to open the first result</div>
          </div>
        </div>
      )}
    </div>
  );
}
