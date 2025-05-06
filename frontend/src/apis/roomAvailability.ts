import { IRoomAvailabilityCheck } from "@/app/types/roomAvailability";

const apisRoomAvailability = {
  checkRoomAvailabilityByPropertyId: async (data: IRoomAvailabilityCheck) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/room-availability/check-room-availability`,
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
  getListRoomAvailabilityBypropertyId: async (
    propertyId: string,
    query?: Record<string, string | number>
  ) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const response = await fetch(
      `${process.env.URL_SERVER_API}/room-availability/list-room-availability/${propertyId}?${queryString}`,
      {
        method: "GET",
        // headers: {
        //   "Content-Type": "application/json", // Specify JSON content type
        // },
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisRoomAvailability;
