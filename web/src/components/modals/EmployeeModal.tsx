"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Employee, EmployeeStatus, Company, Department } from "@/types";
import { toast } from "react-hot-toast";

export default function EmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  employee,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Employee | null;
}) {
  const [names, setNames] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<EmployeeStatus>("ACTIVE");
  const [hiredAt, setHiredAt] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    if (employee) {
      setNames(employee.names);
      setEmail(employee.email);
      setPhone(employee.phone || "");
      setDepartment(
        typeof employee.department === "string"
          ? employee.department
          : employee.department?._id || ""
      );
      setCompany(employee.companies?.[0]?._id || "");
      setStatus(employee.status);
      setHiredAt(employee.hiredAt ? employee.hiredAt.split("T")[0] : "");
    } else {
      setNames("");
      setEmail("");
      setPhone("");
      setDepartment("");
      setCompany("");
      setStatus("ACTIVE");
      setHiredAt("");
    }
  }, [employee]);

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
      setDepartments([]);
      return;
    }
    let cancelled = false;
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const res = await api.get(
          `/department/get-company-departments/${company}`
        );
        if (!cancelled) {
          setDepartments(res.data.departments || []);
        }
      } catch {
        if (!cancelled) {
          toast.error("Failed to load departments");
        }
      } finally {
        if (!cancelled) {
          setLoadingDepartments(false);
        }
      }
    };
    fetchDepartments();
    return () => {
      cancelled = true;
    };
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!names || !email) {
      toast.error("Names and email are required");
      return;
    }
    if (!company) {
      toast.error("Please select a company");
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        names,
        email,
        phone,
        department,
        company,
        status,
      };

      if (hiredAt) {
        payload.hiredAt = hiredAt;
      }

      if (employee) {
        await api.put(`/employee/update-employee/${employee._id}`, payload);
        toast.success("Employee updated successfully");
      } else {
        await api.post(`/employee/add-employee`, payload);
        toast.success("Employee added successfully");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to save employee");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-gray-900">
            {employee ? "Edit Employee" : "Add Employee"}
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
            <label className="block text-sm font-medium text-text mb-1.5">Names *</label>
            <input
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="Enter employee names"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="employee@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="+1 234 567 890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Company *</label>
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
            <label className="block text-sm font-medium text-text mb-1.5">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
               disabled={!company || loadingDepartments}
               className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:opacity-60"
            >
              <option value="">
                {!company
                  ? "Select a company first"
                  : loadingDepartments
                  ? "Loading departments..."
                  : "Select a department"}
              </option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Hire Date</label>
            <input
              type="date"
              value={hiredAt}
              onChange={(e) => setHiredAt(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
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
              {employee ? "Save Changes" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
