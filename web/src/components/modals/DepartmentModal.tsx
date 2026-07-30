"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Department, Company, Employee } from "@/types";
import { toast } from "react-hot-toast";

export default function DepartmentModal({
  department,
  isOpen,
  onClose,
  onSuccess,
}: {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [manager, setManager] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    if (department) {
      setName(department.name || "");
      setCompany(
        typeof department.company === "string"
          ? department.company
          : department.company?._id || ""
      );
      setManager(
        typeof department.manager === "string"
          ? department.manager
          : department.manager?._id || ""
      );
    } else {
      setName("");
      setCompany("");
      setManager("");
    }
  }, [department]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const res = await api.get("/company/get-your-companies");
        if (!cancelled) {
          setCompanies(res.data.companies || []);
        }
      } catch {
        if (!cancelled) {
          toast.error("Failed to load companies");
        }
      } finally {
        if (!cancelled) {
          setLoadingCompanies(false);
        }
      }
    };
    fetchCompanies();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!company) {
      setEmployees([]);
      return;
    }
    let cancelled = false;
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const res = await api.get(`/employee/get-employees/${company}`);
        if (!cancelled) {
          setEmployees(res.data.employees || []);
        }
      } catch {
        if (!cancelled) {
          toast.error("Failed to load employees");
        }
      } finally {
        if (!cancelled) {
          setLoadingEmployees(false);
        }
      }
    };
    fetchEmployees();
    return () => {
      cancelled = true;
    };
  }, [company]);

  useEffect(() => {
    if (!company || !manager) {
      return;
    }
    const exists = employees.some((e) => e._id === manager);
    if (!exists) {
      setManager("");
    }
  }, [company, employees, manager]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) {
      toast.error("Name and company are required");
      return;
    }
    try {
      if (department) {
        await api.put(`/department/update-department/${department._id}`, {
          name,
          company,
          manager: manager || undefined,
        });
        toast.success("Department updated successfully");
      } else {
        await api.post("/department/add-department", {
          name,
          company,
          manager: manager || undefined,
        });
        toast.success("Department added successfully");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error(
        department ? "Failed to update department" : "Failed to add department"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-gray-900">
            {department ? "Edit Department" : "Add Department"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="Enter department name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Company <span className="text-red-500">*</span>
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
               disabled={loadingCompanies}
               className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:opacity-60"
            >
              <option value="">{loadingCompanies ? "Loading companies..." : "Select a company"}</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Manager
            </label>
            <select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
               disabled={!company || loadingEmployees}
               className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:opacity-60"
            >
              <option value="">
                {!company
                  ? "Select a company first"
                  : loadingEmployees
                  ? "Loading employees..."
                  : "Select a manager"}
              </option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.names}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text hover:bg-background-alt transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
            >
              {department ? "Save Changes" : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
