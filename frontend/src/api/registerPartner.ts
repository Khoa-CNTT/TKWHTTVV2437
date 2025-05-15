import http from "@/libs/http";

const apiRegisterPartner = {
  getDetailRegisterPartner: (idUser: string) =>
    http.get(`partner/detail-registerPartner/${idUser}`),

  updateRegisterPartnerByAdmin: (id: string, data: object) =>
    http.put(`partner/update-registerPartner?id=${id}`, data),
  resgister: (data: object) => http.post(`partner/registerPartner`, data),
  cancel: (id: string) => http.delete(`partner/delete-registerPartner/${id}`),
  getAllRegisterPartner: (status: string, filter: string, page: number) =>
    http.get(
      `partner/getAll-registerPartner?status=${status}&filter=${filter}&page=${page}`
    ),
};

export default apiRegisterPartner;
