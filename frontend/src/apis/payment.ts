const apisPayment = {
  createUrlPayment: async (data: { orderId: string; amount: number }) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/payment/create-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify(data), // Serialize the data object
      }
    );

    return response.json();
  },

  createUrlPaymentCommission: async (data: {
    orderId: string;
    amount: number;
  }) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/payment/create-url-commission`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify(data), // Serialize the data object
      }
    );

    return response.json();
  },
};

export default apisPayment;
