"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Project, Employee } from "@/types";
import { ArrowLeft, Users, Building2, User, Plus, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  const [addingMembers, setAddingMembers] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/project/get-project/${id}`);
      setProject(res.data.project);
      const companyId = typeof res.data.project.company === "string"
        ? res.data.project.company
        : res.data.project.company._id;
      if (companyId) {
        const empRes = await api.get(`/employee/get-employees/${companyId}`);
        setEmployees(empRes.data.employees || []);
      }
    } catch (error) {
      console.error("Failed to fetch project", error);
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeeIds((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) {
        next.delete(employeeId);
      } else {
        next.add(employeeId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedEmployeeIds((prev) => {
      const allCompanyEmployeeIds = new Set(
        employees.map((e) => e._id)
      );
      if (prev.size === employees.length && employees.length > 0) {
        return new Set();
      }
      return allCompanyEmployeeIds;
    });
  };

  const handleAddSelectedMembers = async () => {
    if (selectedEmployeeIds.size === 0) {
      toast.error("Select at least one employee");
      return;
    }
    setAddingMembers(true);
    try {
      await api.post(`/project/bulk-add-members/${id}`, {
        members: Array.from(selectedEmployeeIds),
      });
      toast.success("Members added");
      setSelectedEmployeeIds(new Set());
      fetchProject();
    } catch (error) {
      console.error("Failed to add members", error);
      toast.error("Failed to add members");
    } finally {
      setAddingMembers(false);
    }
  };

  const getCompanyName = (company: Project["company"]) => {
    if (typeof company === "string") return company;
    return company.name;
  };

  const getManagerName = (manager: Project["manager"]) => {
    if (!manager) return "Not assigned";
    return manager.names;
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (!project) {
    return <p className="text-gray-500">Project not found.</p>;
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

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{project.name}</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="font-medium">{project.description || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{getCompanyName(project.company)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User size={18} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Manager</p>
              <p className="font-medium">{getManagerName(project.manager)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} />
            Members ({project.members?.length || 0})
          </h2>
          <button
            onClick={() => setShowEmployeeList(!showEmployeeList)}
             className="text-sm text-primary hover:text-gray-900 font-medium"
          >
            {showEmployeeList ? "Hide employees" : "Add from company employees"}
          </button>
        </div>

        {!project.members || project.members.length === 0 ? (
          <p className="text-gray-500">No members in this project.</p>
        ) : (
          <div className="space-y-3 mb-6">
            {project.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{member.names}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showEmployeeList && (
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">
                Employees from {getCompanyName(project.company)}
              </p>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-sm text-primary hover:text-gray-900"
              >
                {selectedEmployeeIds.size === employees.length && employees.length > 0 ? (
                  <CheckSquare size={16} />
                ) : (
                  <Square size={16} />
                )}
                {selectedEmployeeIds.size === employees.length && employees.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {employees.length === 0 ? (
              <p className="text-sm text-gray-500">No employees found for this company.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                {employees.map((employee) => {
                  const alreadyMember = project.members?.some(
                    (m) => m._id === employee._id
                  );
                  return (
                    <label
                      key={employee._id}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                        alreadyMember
                          ? "bg-gray-50/50 opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmployeeIds.has(employee._id) || alreadyMember}
                        disabled={alreadyMember}
                        onChange={() => toggleEmployeeSelection(employee._id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{employee.names}</p>
                        <p className="text-xs text-gray-500">{employee.email}</p>
                      </div>
                      {alreadyMember && (
                        <span className="ml-auto text-xs text-gray-400">Already member</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddSelectedMembers}
                disabled={addingMembers || selectedEmployeeIds.size === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
              >
                <Plus size={18} />
                {addingMembers
                  ? "Adding..."
                  : `Add ${selectedEmployeeIds.size} Selected`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
