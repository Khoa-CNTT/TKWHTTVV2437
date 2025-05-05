"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import apisAdmin from "@/api/admin";

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminContextType {
  users: IUser[];
  fetchUsers: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<IUser[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await apisAdmin.listUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminContext.Provider value={{ users, fetchUsers }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};