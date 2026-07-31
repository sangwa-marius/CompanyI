"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Company } from "@/types";
import CompanyModal from "@/components/modals/CompanyModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import { toast } from "react-hot-toast";

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await api.get("/company/get-your-companies");
      setCompanies(response.data.companies || []);
    } catch (_) {
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredCompanies = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return companies.filter((company) =>
      company.name.toLowerCase().includes(term),
    );
  }, [companies, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!deletingId) return;
    try {
      await api.delete(`/company/delete-company/${id}`);
      toast.success("Company deleted successfully");
      fetchCompanies();
    } catch (_) {
      toast.error("Failed to delete company");
    } finally {
      setDeletingId(null);
    }
  };

  const openAddModal = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const openEditModal = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Companies
          </h1>
          <p className="text-muted mt-1">Manage your registered companies</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Company
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Search companies by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No companies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company._id}
              className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => router.push(`/companies/${company._id}`)}
                >
                  <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
                    {company.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                      company.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {company.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div
                className="cursor-pointer space-y-2 mb-6"
                onClick={() => router.push(`/companies/${company._id}`)}
              >
                {company.email && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {company.email}
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 3V3z" />
                    </svg>
                    {company.phone}
                  </div>
                )}
                {company.address && (
                  <div className="flex items-start gap-2 text-sm text-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {company.address}
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t border-border pt-4">
                <button
                  onClick={() => openEditModal(company)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setDeletingId(company._id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CompanyModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCompany(null);
          }}
          onSuccess={fetchCompanies}
          company={editingCompany}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        title="Delete company"
        message="Are you sure you want to delete this company? This action cannot be undone."
      />
    </div>
  );
}
