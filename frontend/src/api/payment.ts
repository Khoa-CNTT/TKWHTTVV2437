import http from "@/libs/http";

const apiPayment = {
  uploadImageToCloud: async (formData: FormData) => {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const responseData = await response.json();

    return {
      data: responseData,
      status: response.status,
    };
  },
  createAccountPayment: (token: string, data: object) =>
    http.post(`account-payment/create`, data, {
      headers: { token: `Bearer ${token}` },
    }),
  infoAccountPayment: (uid: string) =>
    http.get(`account-payment//infoAccountPaymment?uid=${uid}`),
  updateAccountPayment: (token: string, aid: string, data: object) =>
    http.put(`account-payment/updateAccountPaymment?aid=${aid}`, data, {
      headers: { token: `Bearer ${token}` },
    }),
  deleteAccountPayment: (aid: string, token: string) =>
    http.delete(`account-payment/deleteAccountPaymment?aid=${aid}`, {
      headers: { token: `Bearer ${token}` },
    }),
};

export default apiPayment;
