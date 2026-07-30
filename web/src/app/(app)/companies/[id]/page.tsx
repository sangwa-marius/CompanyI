"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Company, Department, Employee, Project } from "@/types";
import { toast } from "react-hot-toast";

type TabKey = "overview" | "departments" | "employees" | "projects";

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  const fetchCompany = useCallback(async () => {
    try {
      const response = await api.get(`/company/get-company/${companyId}`);
      setCompany(response.data);
    } catch (_) {
      toast.error("Failed to fetch company details");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const fetchDepartments = useCallback(async () => {
    setTabLoading(true);
    try {
      const response = await api.get(
        `/department/get-company-departments/${companyId}`
      );
      setDepartments(response.data.departments || response.data || []);
    } catch (_) {
      toast.error("Failed to fetch departments");
    } finally {
      setTabLoading(false);
    }
  }, [companyId]);

  const fetchEmployees = useCallback(async () => {
    setTabLoading(true);
    try {
      const response = await api.get(`/employee/get-employees/${companyId}`);
      setEmployees(response.data.employees || []);
    } catch (_) {
      toast.error("Failed to fetch employees");
    } finally {
      setTabLoading(false);
    }
  }, [companyId]);

  const fetchProjects = useCallback(async () => {
    setTabLoading(true);
    try {
      const response = await api.get(
        `/project/get-all-company-projects/${companyId}`
      );
      setProjects(response.data.projects || []);
    } catch (_) {
      toast.error("Failed to fetch projects");
    } finally {
      setTabLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      fetchCompany();
    }
  }, [companyId, fetchCompany]);

  useEffect(() => {
    if (!company) return;
    fetchDepartments();
    fetchEmployees();
    fetchProjects();
  }, [company, fetchDepartments, fetchEmployees, fetchProjects]);

  useEffect(() => {
    if (activeTab === "departments" && departments.length === 0 && company) {
      fetchDepartments();
    } else if (
      activeTab === "employees" &&
      employees.length === 0 &&
      company
    ) {
      fetchEmployees();
    } else if (activeTab === "projects" && projects.length === 0 && company) {
      fetchProjects();
    }
  }, [activeTab, company, departments.length, employees.length, projects.length, fetchDepartments, fetchEmployees, fetchProjects]);

  const getStatusColor = (status: string | boolean) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-700";
      case "ONGOING":
        return "bg-blue-50 text-blue-700";
      case "INACTIVE":
      case "PLANNED":
        return "bg-yellow-50 text-yellow-700";
      case "COMPLETED":
        return "bg-green-50 text-green-700";
      case "SUSPENDED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted text-lg">Company not found</p>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "departments", label: "Departments" },
    { key: "employees", label: "Employees" },
    { key: "projects", label: "Projects" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {company.name}
          </h1>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
              company.isActive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {company.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-text mb-4">
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {company.email && (
              <div>
                <p className="text-sm text-muted mb-1">Email</p>
                <div className="flex items-center gap-2 text-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-muted"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {company.email}
                </div>
              </div>
            )}
            {company.phone && (
              <div>
                <p className="text-sm text-muted mb-1">Phone</p>
                <div className="flex items-center gap-2 text-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-muted"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 3V3z" />
                  </svg>
                  {company.phone}
                </div>
              </div>
            )}
            {company.address && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted mb-1">Address</p>
                <div className="flex items-start gap-2 text-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-muted mt-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {company.address}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="border-b border-border">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted hover:text-text"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {tabLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-background-alt rounded-lg p-4 border border-border">
                      <p className="text-sm text-muted">Departments</p>
                       <p className="text-2xl font-bold text-gray-900 mt-1">
                        {departments.length}
                      </p>
                    </div>
                    <div className="bg-background-alt rounded-lg p-4 border border-border">
                      <p className="text-sm text-muted">Employees</p>
                       <p className="text-2xl font-bold text-gray-900 mt-1">
                        {employees.length}
                      </p>
                    </div>
                    <div className="bg-background-alt rounded-lg p-4 border border-border">
                      <p className="text-sm text-muted">Projects</p>
                       <p className="text-2xl font-bold text-gray-900 mt-1">
                        {projects.length}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "departments" && (
                  <div>
                    {departments.length === 0 ? (
                      <p className="text-muted text-center py-12">
                        No departments found
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {departments.map((dept) => (
                          <div
                            key={dept._id}
                            className="border border-border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-text">
                                  {dept.name}
                                </h3>
                                {dept.manager && (
                                  <p className="text-sm text-muted mt-1">
                                    Manager:{" "}
                                    {typeof dept.manager === "object" &&
                                    "names" in dept.manager
                                      ? dept.manager.names
                                      : "—"}
                                  </p>
                                )}
                                {dept.members && (
                                  <p className="text-sm text-muted mt-1">
                                    Members: {dept.members.length}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "employees" && (
                  <div>
                    {employees.length === 0 ? (
                      <p className="text-muted text-center py-12">
                        No employees found
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {employees.map((employee) => (
                          <div
                            key={employee._id}
                            className="border border-border rounded-lg p-4 flex items-center justify-between"
                          >
                            <div>
                              <h3 className="font-semibold text-text">
                                {employee.names}
                              </h3>
                              <p className="text-sm text-muted">
                                {employee.email}
                              </p>
                              {employee.department && (
                                <p className="text-sm text-muted">
                                  Department:{" "}
                                  {typeof employee.department === "object" &&
                                  "name" in employee.department
                                    ? employee.department.name
                                    : "—"}
                                </p>
                              )}
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                employee.status
                              )}`}
                            >
                              {employee.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "projects" && (
                  <div>
                    {projects.length === 0 ? (
                      <p className="text-muted text-center py-12">
                        No projects found
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div
                            key={project._id}
                            className="border border-border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-text">
                                  {project.name}
                                </h3>
                                {project.description && (
                                  <p className="text-sm text-muted mt-1">
                                    {project.description}
                                  </p>
                                )}
                                {project.manager && (
                                  <p className="text-sm text-muted mt-1">
                                    Manager:{" "}
                                    {typeof project.manager === "object" &&
                                    "names" in project.manager
                                      ? project.manager.names
                                      : "—"}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  project.status
                                )}`}
                              >
                                {project.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
  
  );
}
