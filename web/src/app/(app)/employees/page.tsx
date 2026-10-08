"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { STATUS_COLORS } from "@/lib/constants";
import type { Company, Employee, EmployeeStatus } from "@/types";
import EmployeeModal from "@/components/modals/EmployeeModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Plus, Search, Users } from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const companiesRes = await api.get("/company/get-your-companies");
      const companies: Company[] = companiesRes.data.companies || [];

      const results = await Promise.allSettled(
        companies.map((company: Company) =>
          api.get(`/employee/get-employees/${company._id}`).catch(() => ({
            data: [],
          }))
        )
      );

      const allEmployees: Employee[] = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          allEmployees.push(
            ...(result.value.data.employees || [])
          );
        }
      });

      setEmployees(allEmployees);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status !== 404) {
          toast.error("Failed to fetch employees");
        }
      }
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!deletingId) return;
    try {
      await api.put(`/employee/delete-employee/${id}`);
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete employee";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchEmployees();
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-primary">People</p><h1 className="mt-1 text-3xl font-bold tracking-[-.04em] text-[#17251b]">Employees</h1><p className="mt-1 text-sm text-muted">A complete view of your organization&apos;s people.</p></div>
        <button
          onClick={handleAddEmployee}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#e0e8e1] bg-white p-3 shadow-soft sm:flex-row">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-[#e2e9e3] bg-[#f9fbf9] py-2.5 pl-10 pr-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" /></div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | "")}
          className="rounded-xl border border-[#e2e9e3] bg-[#f9fbf9] px-3 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[260px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-[#e0e8e1] bg-white shadow-soft"><div className="flex items-center gap-2 border-b border-[#edf1ed] px-5 py-4 text-sm text-muted"><Users className="h-4 w-4 text-primary" />{filteredEmployees.length} team members</div><div className="overflow-x-auto"><table className="w-full min-w-[760px]">
            <thead className="bg-[#f8faf8]">
              <tr>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted">Email</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted">Department</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted">Companies</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted">Hire Date</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee._id} className="border-t border-[#edf1ed] transition-colors hover:bg-[#f8fbf8]">
                  <td className="px-5 py-3.5 font-semibold text-[#26362a]">{employee.names}</td>
                  <td className="px-4 py-3 text-text">{employee.email}</td>
                  <td className="px-4 py-3 text-text">
                    {typeof employee.department === "string"
                      ? employee.department
                      : employee.department?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-text">
                    {employee.companies?.length || 0}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[employee.status]}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text">
                    {employee.hiredAt ? new Date(employee.hiredAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-1.5 text-primary hover:text-secondary hover:bg-primary/10 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingId(employee._id)}
                        className="p-1.5 text-danger hover:opacity-80 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div></div>

          {filteredEmployees.length > pageSize && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="text-sm text-muted">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredEmployees.length)} of{" "}
                {filteredEmployees.length} employees
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-text hover:bg-background-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="text-sm text-muted px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-text hover:bg-background-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {filteredEmployees.length === 0 && !loading && (
        <div className="text-center py-8 text-muted">No employees found</div>
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        employee={editingEmployee}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDeleteEmployee(deletingId)}
        title="Delete employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </div>
  );
}
