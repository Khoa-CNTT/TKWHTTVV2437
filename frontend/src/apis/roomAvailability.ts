import { IRoomAvailabilityCheck } from "@/app/types/roomAvailability";

const apisRoomAvailability = {
    checkRoomAvailabilityByPropertyId: async (data:IRoomAvailabilityCheck) => {
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
  };
  
  export default apisRoomAvailability;
  