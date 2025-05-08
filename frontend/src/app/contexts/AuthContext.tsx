"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import apiUser from "@/api/user";
import { IUser } from "../types/user";

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
  user: IUser | null; // Bạn có thể thay thế `any` bằng kiểu dữ liệu cụ thể của user
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;

}

// Tạo context với kiểu dữ liệu mặc định
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);

  const handleGetDetailUser = async (id: string, token: string) => {
    try {
      const response = await apiUser.getDetailUser(id, token);
      if (response?.status === "OK") {
        setUser({
          id: response.data.id,
          email: response.data.email,
          phone: response.data.phone,
          avatar: response.data.avatar,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role,
          bio: response.data.bio,
          gender: response.data.gender,
          dateOfBirth: response.data.dateOfBirth,
          emergencyPhone: response.data.emergencyPhone,
          address: response.data.address,
        }); // Lưu thông tin user vào state
      } else {
        console.error("Failed to fetch user details:", response?.msg);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const decoded: { id: string } = jwtDecode(token); // Giải mã token

        if (decoded?.id) {
          handleGetDetailUser(decoded.id, token); // Lấy thông tin user
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
