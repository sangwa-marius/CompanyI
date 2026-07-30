"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { STATUS_COLORS } from "@/lib/constants";
import { Employee } from "@/types";
import { toast } from "react-hot-toast";

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get<Employee>(`/employee/get-employee/${params.id}`);
        setEmployee(response.data);
      } catch {
        toast.error("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text">Employee not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text">{employee.names}</h1>
            <p className="text-lg text-muted mt-1">{employee.email}</p>
            {employee.phone && (
              <p className="text-md text-muted mt-1">{employee.phone}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[employee.status]}`}
          >
            {employee.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-4">Department Info</h2>
          {typeof employee.department === "string" ? (
            <p className="text-text">{employee.department}</p>
          ) : employee.department ? (
            <div>
              <p className="text-text font-medium">{employee.department.name}</p>
              {employee.department.company && (
                <p className="text-muted mt-1">
                  Company:{" "}
                  {typeof employee.department.company === "string"
                    ? employee.department.company
                    : employee.department.company.name}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted">No department assigned</p>
          )}
        </div>

        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-4">Company Affiliations</h2>
          {employee.companies && employee.companies.length > 0 ? (
            <ul className="space-y-2">
              {employee.companies.map((company) => (
                <li key={company._id} className="text-text">
                  {company.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No company affiliations</p>
          )}
        </div>

        <div className="bg-surface rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold text-text mb-4">Projects Assigned</h2>
          <p className="text-muted">No projects assigned</p>
        </div>
      </div>
    </div>
  );
}