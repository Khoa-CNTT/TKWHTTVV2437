import { IPropertyCreate } from "@/app/types/property";

const apisProperty = {
  getListTop10Rating: async () => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/list-top-10-rating`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getListProperty: async (query: Record<string, string | number>) => {
    // Tạo query string từ object query
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const response = await fetch(
      `${process.env.URL_SERVER_API}/property?${queryString}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getPropertyBySlug: async (slug: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/detail/${slug}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getPropertyById: async (id: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/detail-id/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  getListAmenitiesByPropertyId: async (id: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/amenities/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  getListHighlightByPropertyId: async (id: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/hightlights/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  createProperty: async (data: IPropertyCreate) => {
    const response = await fetch(`${process.env.URL_SERVER_API}/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify(data), // Serialize the data object
    });

    return response.json();
  },

  updateProperty: async (propertyId: string, data: IPropertyCreate) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/${propertyId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify(data), // Serialize the data object
      }
    );

    return response.json();
  },
};

export default apisProperty;
