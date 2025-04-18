import http from "@/libs/http";

const apiReservation = {
  createReservation: (data: object) =>
    http.post(`reservation/createReservation`, data),
};

export default apiReservation;
