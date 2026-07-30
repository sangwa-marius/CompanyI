"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Project, ProjectStatus, Company } from "@/types";
import ProjectModal from "@/components/modals/ProjectModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import { Plus, Pencil, Trash2, Users, Building2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const companiesRes = await api.get("/company/get-your-companies");
      const companies: Company[] = companiesRes.data.companies || [];

      const results = await Promise.allSettled(
        companies.map((company) =>
          api.get(`/project/get-all-company-projects/${company._id}`).catch(() => ({
            data: { projects: [] }
          }))
        )
      );

      const allProjects: Project[] = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          allProjects.push(
            ...(result.value.data.projects || [])
          );
        }
      });

      setProjects(allProjects);
    } catch (error) {
      console.error("Failed to fetch projects", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!deletingId) return;
    try {
      await api.delete(`/project/delete-project/${id}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.error("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleSuccess = () => {
    fetchProjects();
  };

  const columns: { status: ProjectStatus; label: string }[] = [
    { status: "PLANNED", label: "Planned" },
    { status: "ONGOING", label: "Ongoing" },
    { status: "COMPLETED", label: "Completed" },
  ];

  const getCompanyName = (company: Project["company"]) => {
    if (typeof company === "string") return company;
    return company?.name || "";
  };

  const getManagerName = (manager: Project["manager"]) => {
    if (!manager) return null;
    return manager.names;
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnProjects = projects.filter(
            (p) => p.status === column.status
          );
          return (
            <div
              key={column.status}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <h2 className="font-semibold text-gray-700 mb-4">
                {column.label} ({columnProjects.length})
              </h2>
              <div className="space-y-3">
                {columnProjects.length === 0 && (
                  <p className="text-sm text-gray-400">No projects</p>
                )}
                {columnProjects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => router.push(`/projects/${project._id}`)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {project.name}
                      </h3>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEdit(project)}
                          className="p-1 text-gray-500 hover:text-primary hover:bg-green-50 rounded"
                        >
                          <Pencil size={14} />
                        </button>
                         <button
                           onClick={() => setDeletingId(project._id)}
                           className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      {getManagerName(project.manager) && (
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          <span>{getManagerName(project.manager)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>{project.members?.length || 0} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 size={14} />
                        <span>{getCompanyName(project.company)}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <ProjectModal
          isOpen={showModal}
          project={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        title="Delete project"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
}
