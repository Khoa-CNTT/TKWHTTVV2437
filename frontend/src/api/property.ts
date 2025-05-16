import http from "@/libs/http";

const apiProperty = {
  getAllPropertyByAdmin: () => http.get(`property/getAllPropertyByAdmin`),
};

export default apiProperty;
