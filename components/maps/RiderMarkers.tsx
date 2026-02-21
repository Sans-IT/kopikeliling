import { Rider } from "@/lib/type";
import { useRouter } from "expo-router";
import React from "react";
import { Callout, LatLng, Marker } from "react-native-maps";

export interface RiderMarkersProps {
  riders: Rider[];
  onRiderPress: (rider: Rider) => void;
  markerRefs: React.MutableRefObject<{ [key: string]: any }>;
}

const RiderMarkers = ({
  riders,
  onRiderPress,
  markerRefs,
}: RiderMarkersProps) => {
  const router = useRouter();

  const handleNavigateToStock = (rider: Rider) => {
    router.push({
      pathname: "/rider/[id]",
      params: { id: rider.id },
    });
  };

  return (
    <>
      {riders.map((rider: Rider) => {
        const isOpen = rider.isOpen;
        const statusLabel = isOpen ? "BUKA" : "TUTUP";
        const scheduleDesc = `${rider.workStartTime}-${rider.workEndTime}`;

        return (
          <Marker
            ref={(el) => {
              if (markerRefs.current) {
                markerRefs.current[rider.id] = el;
              }
            }}
            key={rider.id}
            coordinate={{
              latitude: rider.latitude,
              longitude: rider.longitude,
            }}
            tracksViewChanges={false}
            title={`Rider ${rider.name} • (${statusLabel})`}
            description={scheduleDesc}
            onPress={(e) => {
              e.stopPropagation();
              onRiderPress(rider);
            }}
            onCalloutPress={() => {
              if (isOpen) {
                handleNavigateToStock(rider);
              } else {
                alert("Maaf, Rider sedang tidak aktif.");
              }
            }}
          >
            <Callout />
          </Marker>
        );
      })}
    </>
  );
};

export default RiderMarkers;
