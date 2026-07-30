"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { STATUS_COLORS } from "@/lib/constants";
import type { Company, Employee, EmployeeStatus } from "@/types";
import EmployeeModal from "@/components/modals/EmployeeModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

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
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchEmployees();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">Employees</h1>
        <button
          onClick={handleAddEmployee}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          Add Employee
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
           className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | "")}
          className="px-3 py-2 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <table className="w-full bg-surface border border-border rounded-lg overflow-hidden">
            <thead className="bg-background-alt">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Companies</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Hire Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee._id} className="border-t border-border">
                  <td className="px-4 py-3 text-text">{employee.names}</td>
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
          </table>

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