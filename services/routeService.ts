import { LatLng } from "react-native-maps";

export const getOSRMRoute = async (
	start: LatLng,
	end: LatLng,
): Promise<LatLng[]> => {
	try {
		const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
		const response = await fetch(url);
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
		console.error("OSRM Error:", error);
		return [];
	}
};
