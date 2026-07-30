"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Company } from "@/types";
import { toast } from "react-hot-toast";

export default function CompanyModal({
  isOpen,
  onClose,
  onSuccess,
  company,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company: Company | null;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        isActive: company.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        isActive: true,
      });
    }
  }, [company, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    try {
      if (company) {
        await api.put(`/company/update-company/${company._id}`, formData);
        toast.success("Company updated successfully");
      } else {
        await api.post("/company/add-company", formData);
        toast.success("Company added successfully");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error(
        company ? "Failed to update company" : "Failed to add company"
      );
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
            {company ? "Edit Company" : "Add Company"}
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
            <label className="block text-sm font-medium text-text mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="company@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="+1 234 567 890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
              placeholder="Enter company address"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-text"
            >
              Active
            </label>
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
              {company ? "Save Changes" : "Add Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
