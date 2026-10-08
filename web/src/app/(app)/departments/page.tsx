"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Company, Department } from "@/types";
import DepartmentModal from "@/components/modals/DepartmentModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import { Plus, Pencil, Trash2, Building2, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const companiesRes = await api.get("/company/get-your-companies");
      const companies: Company[] = companiesRes.data.companies || [];

      const results = await Promise.allSettled(
        companies.map((company: Company) =>
          api
            .get(`/department/get-company-departments/${company._id}`)
            .catch(() => ({ data: { departments: [] } }))
        )
      );

      const allDepartments: Department[] = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          allDepartments.push(
            ...(result.value.data.departments || [])
          );
        }
      });

      setDepartments(allDepartments);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDelete = async (id: string) => {
    if (!deletingId) return;
    try {
      await api.delete(`/department/delete-department/${id}`);
      toast.success("Department deleted");
      fetchDepartments();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete department";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingDept(null);
    setShowModal(true);
  };

  const handleSuccess = () => {
    fetchDepartments();
  };

  const getCompanyName = (company: Department["company"]) => {
    if (typeof company === "string") return company;
    return company?.name || "";
  };

  const getManagerName = (manager: Department["manager"]) => {
    if (!manager) return null;
    return manager.names;
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-primary">Organization</p><h1 className="mt-1 text-3xl font-bold tracking-[-.04em] text-[#17251b]">Departments</h1><p className="mt-1 text-sm text-muted">Structure teams and keep ownership clear.</p></div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
        >
          <Plus size={18} />
          Add Department
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[260px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : departments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#dce6de] bg-white py-20 text-center text-muted">No departments found. Add your first department to get started.</div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <div
              key={dept._id}
              onClick={() => router.push(`/departments/${dept._id}`)}
              className="group cursor-pointer rounded-2xl border border-[#e0e8e1] bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-panel"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold tracking-tight text-[#17251b] group-hover:text-primary">
                  {dept.name}
                </h3>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openEdit(dept)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingId(dept._id)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2.5 border-t border-[#edf1ed] pt-4 text-sm text-[#637066]">
                {getManagerName(dept.manager) && (
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>Manager: {getManagerName(dept.manager)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>Employees: {dept.members?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={14} />
                  <span>{getCompanyName(dept.company)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <DepartmentModal
          isOpen={showModal}
          department={editingDept}
          onClose={() => {
            setShowModal(false);
            setEditingDept(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        title="Delete department"
        message="Are you sure you want to delete this department? This action cannot be undone."
      />
    </div>
  );
}
