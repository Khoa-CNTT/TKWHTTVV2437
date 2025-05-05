const apisCommissionPayment = {
  getListCommissionPaymentByPropertyId: async (propertyId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/commission/all-commission/${propertyId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  updateCommissionPayment: async (id: string, data: { userId: string }) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/commission/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },
};

export default apisCommissionPayment;
