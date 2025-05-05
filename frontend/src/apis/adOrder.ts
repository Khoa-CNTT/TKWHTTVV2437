import { IAdOrder } from "@/app/types/adOrder";

const apisAdOrder = {
  createAdOrder: async (data: IAdOrder) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/ad-order/create`,
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

export default apisAdOrder;
