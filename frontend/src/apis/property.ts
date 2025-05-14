import { IPropertyCreate } from "@/app/types/property";

const apisProperty = {
  getListTop10Rating: async () => {
    try {
      const response = await fetch(
        `${process.env.URL_SERVER_API}/property/list-top-10-rating`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching top 10 rating properties:", error);
      return {
        status: "ERR",
        data: [],
        message: "Không thể kết nối đến server",
      };
    }
  },

  getListPropertyByAdmin: async (query: Record<string, string | number>) => {
    // Tạo query string từ object query
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/admin/list-property?${queryString}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  getPropertyIdByUserId: async (userId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/property-id-by-user-id/${userId}`,
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
  getImageByPropertyId: async (id: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/image-by-property-id/${id}`,
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
  getPropertyByUserId: async (id: string | undefined) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/detail-user-id/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  getTextSearchProperty: async (query: Record<string, string | number>) => {
    // Tạo query string từ object query
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/search?${queryString}`,
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

  updateStatusProperty: async (propertyId: string, status: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/admin/update-status/${propertyId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({ status }), // Serialize the data object
      }
    );

    return response.json();
  },

  getAdvertisingByPropertyId: async (propertyId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/advertising/${propertyId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  getTotalDashboardByPropertyId: async (propertyId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/total-dashboard/${propertyId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisProperty;
