"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { COLORS } from "@/lib/constants";
import type { Company, Employee, Department, Project } from "@/types";
import type { Activity } from "@/types";
import {
  Building2,
  Users,
  Briefcase,
  FolderTree,
  TrendingUp,
  UserPlus,
  FolderOpen,
  Activity,
  CalendarDays,
  X,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PIE_COLORS = [
  "#166534",
  "#16a34a",
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
];

const ACTIVITY_CONFIG: Record<
  string,
  { icon: typeof Activity; color: string; bg: string; label: string }
> = {
  Company: {
    icon: Building2,
    color: "text-primary",
    bg: "bg-primary/10",
    label: "New company added",
  },
  Employee: {
    icon: UserPlus,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "New employee joined",
  },
  Project: {
    icon: FolderOpen,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "New project created",
  },
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const companiesRes = await api.get("/company/get-your-companies");
        const companiesList: Company[] = companiesRes.data.companies || [];
        setCompanies(companiesList);

        const companiesToFetch = companiesList.slice(0, 5);

        const results = await Promise.allSettled(
          companiesToFetch.map(async (company) => {
            const [empRes, deptRes, projRes] = await Promise.all([
              api.get(`/employee/get-employees/${company._id}`).catch(() => ({
                data: { employees: [] },
              })),
              api.get(`/department/get-company-departments/${company._id}`).catch(
                () => ({ data: { departments: [] } })
              ),
              api.get(`/project/get-all-company-projects/${company._id}`).catch(
                () => ({ data: { projects: [] } })
              ),
            ]);

            const emps = empRes.data.employees || [];
            const depts = deptRes.data.departments || [];
            const projs = projRes.data.projects || [];

            return { emps, depts, projs };
          })
        );

        const allEmployees: Employee[] = [];
        const allDepartments: Department[] = [];
        const allProjects: Project[] = [];

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            allEmployees.push(...result.value.emps);
            allDepartments.push(...result.value.depts);
            allProjects.push(...result.value.projs);
          }
        });

        setEmployees(allEmployees);
        setDepartments(allDepartments);
        setProjects(allProjects);
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
        setError("Failed to load dashboard data");
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const totalCompanies = companies.length;
  const totalEmployees = employees.length;
  const activeProjects = projects.filter(
    (p) => p.status === "ONGOING" || p.status === "COMPLETED"
  ).length;
  const totalDepartments = departments.length;

  const employeesByCompany = useMemo(() => {
    const map: Record<string, number> = {};
    employees.forEach((emp) => {
      if (emp.companies && emp.companies.length > 0) {
        const companyId = emp.companies[0]._id;
        map[companyId] = (map[companyId] || 0) + 1;
      }
    });
    return companies.map((c) => ({
      name: c.name,
      employees: map[c._id] || 0,
    }));
  }, [companies, employees]);

  const projectStatusData = useMemo(() => {
    const planned = projects.filter((p) => p.status === "PLANNED").length;
    const ongoing = projects.filter((p) => p.status === "ONGOING").length;
    const completed = projects.filter((p) => p.status === "COMPLETED").length;
    return [
      { name: "Planned", value: planned, color: "#f59e0b" },
      { name: "Ongoing", value: ongoing, color: "#3b82f6" },
      { name: "Completed", value: completed, color: "#16a34a" },
    ];
  }, [projects]);

  const companyGrowthData = useMemo(() => {
    const base = Math.max(1, totalCompanies - 3);
    return [
      { month: "Jan", companies: Math.max(1, base) },
      { month: "Feb", companies: Math.max(1, base + 1) },
      { month: "Mar", companies: Math.max(1, base + 1) },
      { month: "Apr", companies: totalCompanies },
      { month: "May", companies: totalCompanies },
      { month: "Jun", companies: totalCompanies },
    ];
  }, [totalCompanies]);

  const deptEmployeeData = useMemo(() => {
    return departments
      .map((d) => ({
        name: d.name,
        employees: d.members?.length || 0,
      }))
      .sort((a, b) => b.employees - a.employees);
  }, [departments]);

  const employeesByDept = useMemo(() => {
    const map: Record<string, number> = {};
    departments.forEach((d) => {
      map[d.name] = d.members?.length || 0;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [departments]);

  const recentActivity = useMemo(() => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const items: { type: string; name: string; date: string }[] = [];

    companies.forEach((c) => {
      if (c.createdAt && new Date(c.createdAt) >= twoDaysAgo) {
        items.push({
          type: "Company",
          name: c.name,
          date: c.createdAt,
        });
      }
    });

    employees.forEach((e) => {
      if (e.createdAt && new Date(e.createdAt) >= twoDaysAgo) {
        items.push({
          type: "Employee",
          name: e.names,
          date: e.createdAt,
        });
      }
    });

    projects.forEach((p) => {
      if (p.createdAt && new Date(p.createdAt) >= twoDaysAgo) {
        items.push({
          type: "Project",
          name: p.name,
          date: p.createdAt,
        });
      }
    });

    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [companies, employees, projects]);

  const stats = [
    {
      label: "Total Companies",
      value: totalCompanies,
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10",
      accent: "border-l-primary",
    },
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-secondary",
      bg: "bg-secondary/10",
      accent: "border-l-secondary",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      icon: Briefcase,
      color: "text-accent",
      bg: "bg-accent/10",
      accent: "border-l-accent",
    },
    {
      label: "Departments",
      value: totalDepartments,
      icon: FolderTree,
      color: "text-primary",
      bg: "bg-primary/10",
      accent: "border-l-primary",
    },
  ];

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const openActivityModal = async () => {
    setIsActivityModalOpen(true);
    setActivitiesLoading(true);
    try {
      const res = await api.get("/activity/all");
      setAllActivities(res.data.activities || []);
    } catch {
      toast.error("Failed to load activities");
    } finally {
      setActivitiesLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-danger text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-muted mt-1">
            Welcome back, {user?.username || "User"}! Here is an overview of your
            organization.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted bg-white border border-border rounded-lg px-3 py-2 shadow-sm">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{today}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`group bg-white border border-border border-l-4 ${stat.accent} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-default`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted">
                  {stat.label}
                </span>
                <div
                  className={`p-2 rounded-lg ${stat.bg} ring-1 ring-inset ring-black/[0.04]`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-text">{stat.value}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">+12%</span>
                <span className="text-muted">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraphCard title="Employees by Company">
          {employeesByCompany.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeesByCompany}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="name" stroke={COLORS.muted} fontSize={12} />
                <YAxis stroke={COLORS.muted} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.surface,
                    borderColor: COLORS.border,
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: COLORS.text }}
                />
                <Bar
                  dataKey="employees"
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="No employee data available" />
          )}
        </GraphCard>

        <GraphCard title="Project Status Distribution">
          {projectStatusData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.surface,
                    borderColor: COLORS.border,
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="No project data available" />
          )}
        </GraphCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraphCard title="Company Growth">
          {totalCompanies > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={companyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="month" stroke={COLORS.muted} fontSize={12} />
                <YAxis stroke={COLORS.muted} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.surface,
                    borderColor: COLORS.border,
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: COLORS.text }}
                />
                <Line
                  type="monotone"
                  dataKey="companies"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="No company data available" />
          )}
        </GraphCard>

        <GraphCard title="Department Employee Count">
          {deptEmployeeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptEmployeeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis type="number" stroke={COLORS.muted} fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke={COLORS.muted}
                  fontSize={12}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.surface,
                    borderColor: COLORS.border,
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: COLORS.text }}
                />
                <Bar
                  dataKey="employees"
                  fill={COLORS.secondary}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="No department data available" />
          )}
        </GraphCard>
      </div>

      <GraphCard
        title={
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Recent Activity</span>
          </div>
        }
        footer={
          <button
            onClick={openActivityModal}
            className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Activity className="h-4 w-4" />
            View all activity
          </button>
        }
      >
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((item, idx) => {
              const config = ACTIVITY_CONFIG[item.type] || ACTIVITY_CONFIG.Company;
              const Icon = config.icon;
              return (
                <div
                  key={`${item.type}-${item.name}-${idx}`}
                  className="group flex items-start gap-4 rounded-lg border border-border bg-white/60 p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">
                      {config.label}
                    </p>
                    <p className="text-sm text-muted truncate">{item.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-muted">
                      {formatRelativeTime(item.date)}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {item.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
              <Activity className="h-6 w-6 text-muted" />
            </div>
            <p className="text-muted">No recent activity yet.</p>
            <p className="text-sm text-muted/80 mt-1">
              Start by adding companies, employees, or projects.
            </p>
          </div>
        )}
      </GraphCard>

      {isActivityModalOpen && (
        <ActivityModal
          activities={allActivities}
          loading={activitiesLoading}
          onClose={() => setIsActivityModalOpen(false)}
        />
      )}
    </div>
  );
}

function GraphCard({
  title,
  children,
  footer,
}: {
  title: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-border px-6 py-4 bg-gray-50/50">
        {typeof title === "string" ? (
          <h2 className="text-base font-semibold text-text">{title}</h2>
        ) : (
          <div className="flex items-center gap-2">{title}</div>
        )}
      </div>
      <div className="p-6">{children}</div>
      {footer && (
        <div className="border-t border-border px-6 py-3 bg-gray-50/30">
          {footer}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-[300px]">
      <p className="text-muted text-sm">{text}</p>
    </div>
  );
}

function ActivityModal({
  activities,
  loading,
  onClose,
}: {
  activities: Activity[];
  loading: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-text">All Activities</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:text-text hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((item, idx) => {
                const config =
                  ACTIVITY_CONFIG[item.entityType] || ACTIVITY_CONFIG.Company;
                const Icon = config.icon;
                return (
                  <div
                    key={`${item._id}-${idx}`}
                    className="flex items-start gap-4 rounded-lg border border-border bg-white/60 p-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text truncate">
                        {item.action}
                      </p>
                      <p className="text-sm text-muted truncate">
                        {item.entityName}
                      </p>
                      {item.details && (
                        <p className="text-xs text-muted mt-1 line-clamp-2">
                          {item.details}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs text-muted">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {item.entityType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                <Activity className="h-6 w-6 text-muted" />
              </div>
              <p className="text-muted">No activities found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
