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
    } catch (error) {
      console.error("Failed to delete department", error);
      toast.error("Failed to delete department");
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
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          <Plus size={18} />
          Add Department
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : departments.length === 0 ? (
        <p className="text-gray-500">No departments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept._id}
              onClick={() => router.push(`/departments/${dept._id}`)}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {dept.name}
                </h3>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openEdit(dept)}
                    className="p-1.5 text-gray-500 hover:text-primary hover:bg-green-50 rounded"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingId(dept._id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
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
