"use client";

import { useUserContext } from "@/app/contexts/UserContext";
import UserTable from "@/components/admin/UserTable";

const ManageUsersPage = () => {
  const { users } = useUserContext();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      <UserTable users={users} />
    </div>
  );
};

export default ManageUsersPage;