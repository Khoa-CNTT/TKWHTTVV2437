import http from "@/libs/http";

const apiReservation = {
  lockBooking: (data: object) => http.post(`reservation/lockBooking`, data),
  createReservation: (data: object) =>
    http.post(`reservation/createReservation`, data),

  listReservationApprove: (filter: string, status: string, page: number) =>
    http.get(
      `reservation/listReservationApprove?filter=${filter}&status=${status}&page=${page}`
    ),

  detailReservationApprove: (reid: string) =>
    http.get(`reservation/detailReservationApprove?reid=${reid}`),
  approveReservation: (data: object) =>
    http.put(`reservation/approveReservation`, data),
  listReservationOfUser: (idUser: string) =>
    http.get(`reservation/listReservationOfUser?idUser=${idUser}`),
  detailReservationOfUser: (idRes: string) =>
    http.get(`reservation/detailReservationOfUser?idRes=${idRes}`),
  getTimeOfResLockbyId: (idRes: string) =>
    http.get(`reservation/getTimeOfResLockbyId?idRes=${idRes}`),
  updateInfoReservation: (data: object) =>
    http.put(`reservation/updateInfoReservation`, data),
  updateStatusUserReservation: (data: object) =>
    http.put(`reservation/updateStatusUserReservation`, data),
  getAllReservationByAdmin: (
    idProperty: string,
    filter: string,
    page: number
  ) =>
    http.get(
      `reservation/listReservationByAdmin?filter=${filter}&idProperty=${idProperty}&page=${page}`
    ),
};

export default apiReservation;
