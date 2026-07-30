export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Company {
  _id: string;
  name: string;
  owner: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  _id: string;
  name: string;
  company: string | {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
  };
  manager?: {
    _id: string;
    names: string;
    email: string;
    phone?: string;
    department?: string;
    status: EmployeeStatus;
    companies?: string[];
    hiredAt?: string;
  };
  members?: Array<{
    _id: string;
    names: string;
    email: string;
    phone?: string;
    department?: string;
    status: EmployeeStatus;
    companies?: string[];
    hiredAt?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Employee {
  _id: string;
  names: string;
  email: string;
  phone?: string;
  department?: string | {
    _id: string;
    name: string;
    company: string | {
      _id: string;
      name: string;
    };
    manager?: string;
  };
  status: EmployeeStatus;
  companies: Array<{
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
  }>;
  hiredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectStatus = "PLANNED" | "ONGOING" | "COMPLETED";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  company: string | {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
  };
  manager?: {
    _id: string;
    names: string;
    email: string;
    phone?: string;
    department?: string;
    status: EmployeeStatus;
    companies?: string[];
    hiredAt?: string;
  };
  members?: Array<{
    _id: string;
    names: string;
    email: string;
    phone?: string;
    department?: string;
    status: EmployeeStatus;
    companies?: string[];
    hiredAt?: string;
  }>;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  Total?: number;
}
