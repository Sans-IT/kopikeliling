import { Rider } from "@/lib/type";
import { useRouter } from "expo-router";
import React from "react";
import { Callout, LatLng, Marker } from "react-native-maps";

export interface RiderMarkersProps {
  riders: Rider[];
  myLocation: LatLng;
  onRiderPress: (rider: Rider) => void;
  markerRefs: React.MutableRefObject<{ [key: number]: any }>;
}

const RiderMarkers = ({
  riders,
  myLocation,
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
              latitude: myLocation.latitude + rider.latOffset,
              longitude: myLocation.longitude + rider.lngOffset,
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
