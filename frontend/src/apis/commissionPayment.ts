const apisCommissionPayment = {
  getListCommissionPaymentByPropertyId: async (
    query: Record<string, string | number>,
    propertyId: string
  ) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const response = await fetch(
      `${process.env.URL_SERVER_API}/commission/all-commission/${propertyId}?${queryString}`,
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
  getDataBarChartAdmin: async (query: Record<string, string | number>) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    const response = await fetch(
      `${process.env.URL_SERVER_API}/commission/data-bar-chart-admin?${queryString}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  getListCommissionPaymentByAdmin: async (
    query: Record<string, string | number>
  ) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const response = await fetch(
      `${process.env.URL_SERVER_API}/commission/list-commission-admin?${queryString}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  getCommissionPaymentByPropertyId: async (propertyId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/commission/commission-payment/${propertyId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisCommissionPayment;
