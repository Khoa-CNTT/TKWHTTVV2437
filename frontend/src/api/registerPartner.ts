import http from "@/libs/http";

const apiRegisterPartner = {
  getDetailRegisterPartner: (idUser: string) =>
    http.get(`partner/detail-registerPartner/${idUser}`),

  // updateUser: (id: string, token: string, data: object) =>
  //   http.put(`user/updateUser?id=${id}`, data, {
  //     headers: { token: `Bearer ${token}` },
  //   }),
  resgister: (data: object) => http.post(`partner/registerPartner`, data),
  cancel: (id: string) => http.delete(`partner/delete-registerPartner/${id}`),
};

export default apiRegisterPartner;
