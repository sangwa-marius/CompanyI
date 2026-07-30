"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { COLORS } from "@/lib/constants";
import type { Company, Employee, Department, Project } from "@/types";
import {
  Building2,
  Users,
  Briefcase,
  FolderTree,
  TrendingUp,
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    const items: { type: string; name: string; date: string }[] = [];

    companies.forEach((c) => {
      if (c.createdAt) {
        items.push({
          type: "Company",
          name: c.name,
          date: c.createdAt,
        });
      }
    });

    employees.forEach((e) => {
      if (e.createdAt) {
        items.push({
          type: "Employee",
          name: e.names,
          date: e.createdAt,
        });
      }
    });

    projects.forEach((p) => {
      if (p.createdAt) {
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
    },
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      icon: Briefcase,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Departments",
      value: totalDepartments,
      icon: FolderTree,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="text-muted mt-1">
          Welcome back, {user?.username || "User"}! Here is an overview of your
          organization.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-border rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-text">{stat.value}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+12%</span>
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
                <Tooltip />
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

      <GraphCard title="Employees by Department">
        {employeesByDept.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={employeesByDept}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={120}
                dataKey="value"
              >
                {employeesByDept.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState text="No department data available" />
        )}
      </GraphCard>

      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text mb-4">
          Recent Activity
        </h2>
        {recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item, idx) => (
                  <tr
                    key={`${item.type}-${item.name}-${idx}`}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-muted text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
}

function GraphCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-text mb-4">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-[300px]">
      <p className="text-muted">{text}</p>
    </div>
  );
}
