"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Department } from "@/types";
import { ArrowLeft, Users, Building2, User } from "lucide-react";
import toast from "react-hot-toast";

export default function DepartmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDepartment = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/department/get-department/${id}`);
      setDepartment(res.data.department);
    } catch (error) {
      console.error("Failed to fetch department", error);
      toast.error("Failed to load department");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDepartment();
  }, [id]);

  const getCompanyName = (company: Department["company"]) => {
    if (typeof company === "string") return company;
    return company.name;
  };

  const getManagerName = (manager: Department["manager"]) => {
    if (!manager) return "Not assigned";
    return manager.names;
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (!department) {
    return <p className="text-gray-500">Department not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-primary hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {department.name}
      </h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{getCompanyName(department.company)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User size={18} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Manager</p>
              <p className="font-medium">{getManagerName(department.manager)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users size={20} />
          Members ({department.members?.length || 0})
        </h2>
        {!department.members || department.members.length === 0 ? (
          <p className="text-gray-500">No members in this department.</p>
        ) : (
          <div className="space-y-3">
            {department.members.map((member) => (
              <div
                key={typeof member === "object" && member?._id ? member._id : String(member)}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {typeof member === "object" && member ? member.names || member.email || "—" : String(member)}
                  </p>
                  {typeof member === "object" && member?.email && (
                    <p className="text-sm text-gray-500">{member.email}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
