import { LatLng } from "react-native-maps";

export const getOSRMRoute = async (
  start: LatLng,
  end: LatLng,
): Promise<LatLng[]> => {
  // Cek jika koordinat kosong sebelum fetch
  if (!start?.latitude || !end?.latitude) {
    console.warn("Koordinat tidak valid!");
    return [];
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;

    const response = await fetch(url);

    // Jika server OSRM nolak (Error 4xx atau 5xx)
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map(
        (coord: [number, number]) => ({
          latitude: coord[1],
          longitude: coord[0],
        }),
      );
    }
    return [];
  } catch (error) {
    // Tangkap error agar tidak Force Close
    console.error("OSRM Fetch Error:", error);
    return [];
  }
};
