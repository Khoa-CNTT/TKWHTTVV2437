import http from "@/libs/http";

const apiUser = {
  checkMail: (data: { email: string }) => http.post(`user/checkMail`, data),

  sendOtpToEmail: (data: { email: string; status?: string }) =>
    http.post(`user/sendMailOTP`, data),

  verifyPassword: (data: { email: string; password: string }) =>
    http.post(`user/sign-in`, data),

  verifyOTP: (data: { email: string; OTP: string }) =>
    http.post(`user/verifyOTP`, data),

  verifyOTPLogin: (data: { email: string; OTP: string }) =>
    http.post(`user/verifyOTPLogin`, data),

  getDetailUser: (id: string, token: string) =>
    http.get(`user/detail-user/${id}`, {
      headers: { token: `Bearer ${token}` },
    }),

  updateUser: (id: string, token: string, data: object) =>
    http.put(`user/updateUser?id=${id}`, data, {
      headers: { token: `Bearer ${token}` },
    }),
  resgister: (data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
  }) => http.post(`user/sign-up`, data),

  refreshToken: () =>
    http.get("user/refresh-token", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }),
};

export default apiUser;
