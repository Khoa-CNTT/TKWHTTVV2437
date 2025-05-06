import http from "@/libs/http";

const apiReservation = {
  createReservation: (data: object) =>
    http.post(`reservation/createReservation`, data),

  listReservationApprove: (filter: string) =>
    http.get(`reservation/listReservationApprove?filter=${filter}`),

  detailReservationApprove: (reid: string) =>
    http.get(`reservation/detailReservationApprove?reid=${reid}`),
  approveReservation: (data: object) =>
    http.put(`reservation/approveReservation`, data),
  listReservationOfUser: (idUser: string) =>
    http.get(`reservation/listReservationOfUser?idUser=${idUser}`),
  detailReservationOfUser: (idRes: string) =>
    http.get(`reservation/detailReservationOfUser?idRes=${idRes}`),
  updateInfoReservation: (data: object) =>
    http.put(`reservation/updateInfoReservation`, data),
};

export default apiReservation;
