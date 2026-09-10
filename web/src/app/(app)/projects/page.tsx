"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Project, ProjectStatus, Company } from "@/types";
import ProjectModal from "@/components/modals/ProjectModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import { Plus, Pencil, Trash2, Users, Building2, ChevronRight, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<ProjectStatus | null>(null);
  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);

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
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete project";
      toast.error(message);
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

  const moveProject = async (projectId: string, nextStatus: ProjectStatus) => {
    const project = projects.find((item) => item._id === projectId);
    if (!project || project.status === nextStatus) return;

    const previousProjects = projects;
    setProjects((current) =>
      current.map((item) =>
        item._id === projectId ? { ...item, status: nextStatus } : item
      )
    );
    setUpdatingProjectId(projectId);

    try {
      const response = await api.put(`/project/update-project/${projectId}`, {
        status: nextStatus,
      });
      const updatedProject = response.data.newProject as Project | undefined;
      if (updatedProject) {
        setProjects((current) =>
          current.map((item) =>
            item._id === projectId ? { ...item, ...updatedProject } : item
          )
        );
      }
      toast.success(`Moved to ${nextStatus.toLowerCase()}`);
    } catch (error: unknown) {
      setProjects(previousProjects);
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Could not update the project status");
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, status: ProjectStatus) => {
    event.preventDefault();
    const projectId = event.dataTransfer.getData("text/project-id") || draggedProjectId;
    setDropTarget(null);
    setDraggedProjectId(null);
    if (projectId) moveProject(projectId, status);
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
        <div><h1 className="text-2xl font-bold text-gray-900">Projects</h1><p className="mt-1 text-sm text-muted">Drag a project between columns to update its status.</p></div>
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
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setDropTarget(column.status);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setDropTarget(null);
                }
              }}
              onDrop={(event) => handleDrop(event, column.status)}
              className={`min-h-[360px] rounded-xl border p-4 transition-colors ${dropTarget === column.status ? "border-primary bg-primary/5 ring-2 ring-primary/15" : "border-gray-200 bg-gray-50"}`}
            >
              <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-gray-700">{column.label}</h2><span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-muted shadow-sm">{columnProjects.length}</span></div>
              <div className="space-y-3">
                {columnProjects.length === 0 && (
                  <p className="rounded-lg border border-dashed border-gray-200 bg-white/60 px-3 py-6 text-center text-sm text-gray-400">Drop a project here</p>
                )}
                {columnProjects.map((project) => (
                  <div
                    key={project._id}
                    draggable={updatingProjectId !== project._id}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/project-id", project._id);
                      setDraggedProjectId(project._id);
                    }}
                    onDragEnd={() => {
                      setDraggedProjectId(null);
                      setDropTarget(null);
                    }}
                    onClick={() => router.push(`/projects/${project._id}`)}
                    className={`relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${draggedProjectId === project._id ? "opacity-50 scale-[.98]" : ""} ${updatingProjectId === project._id ? "pointer-events-none opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex min-w-0 items-start gap-1"><GripVertical size={16} className="mt-0.5 shrink-0 text-gray-300" /><h3 className="font-medium text-gray-900">{project.name}</h3></div>
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
