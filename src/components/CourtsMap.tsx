import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { CourtMarker } from './CourtMarker';
import type { Court } from '@/types';

export interface CourtsMapHandle {
  focusCourt: (lat: number, lng: number) => void;
}

interface CourtsMapProps {
  courts: Court[];
  selectedId: string | null;
  sessionCounts: Record<string, number>;
  onSelect: (id: string) => void;
  onDeselect: () => void;
}

const SYDNEY_REGION = {
  latitude: -33.885,
  longitude: 151.215,
  latitudeDelta: 0.08,
  longitudeDelta: 0.06,
};

export const CourtsMap = forwardRef<CourtsMapHandle, CourtsMapProps>(function CourtsMap(
  { courts, selectedId, sessionCounts, onSelect, onDeselect },
  ref,
) {
  const mapRef = useRef<MapView>(null);

  useImperativeHandle(ref, () => ({
    focusCourt: (lat, lng) => {
      mapRef.current?.animateToRegion(
        {
          latitude: lat - 0.005,
          longitude: lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        350,
      );
    },
  }));

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={SYDNEY_REGION}
      showsUserLocation
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
      onPress={onDeselect}
    >
      {courts.map((court) => (
        <Marker
          key={court.id}
          coordinate={{ latitude: court.latitude, longitude: court.longitude }}
          onPress={(e) => {
            e.stopPropagation();
            onSelect(court.id);
          }}
          anchor={{ x: 0.5, y: 1 }}
          tracksViewChanges={Platform.OS === 'ios' ? false : selectedId === court.id}
        >
          <CourtMarker
            court={court}
            sessionCount={sessionCounts[court.id] ?? 0}
            selected={selectedId === court.id}
          />
        </Marker>
      ))}
    </MapView>
  );
});
