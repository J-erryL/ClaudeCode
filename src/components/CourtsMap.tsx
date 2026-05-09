import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { CourtMarker } from './CourtMarker';
import { PendingMarker } from './PendingMarker';
import type { Court, CourtRequest } from '@/types';

export interface CourtsMapHandle {
  focusCourt: (lat: number, lng: number) => void;
}

interface CourtsMapProps {
  courts: Court[];
  pendingRequests: CourtRequest[];
  selectedId: string | null;
  sessionCounts: Record<string, number>;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  onMapPress?: (lat: number, lng: number) => void;
}

const SYDNEY_REGION = {
  latitude: -33.885,
  longitude: 151.215,
  latitudeDelta: 0.08,
  longitudeDelta: 0.06,
};

export const CourtsMap = forwardRef<CourtsMapHandle, CourtsMapProps>(function CourtsMap(
  { courts, pendingRequests, selectedId, sessionCounts, onSelect, onDeselect, onMapPress },
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
      onPress={(e) => {
        if (onMapPress) {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          onMapPress(latitude, longitude);
        } else {
          onDeselect();
        }
      }}
    >
      {courts.map((court) => (
        <Marker
          key={court.id}
          coordinate={{ latitude: court.latitude, longitude: court.longitude }}
          onPress={(e) => {
            e.stopPropagation();
            if (!onMapPress) onSelect(court.id);
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
      {pendingRequests.map((req) => (
        <Marker
          key={req.id}
          coordinate={{ latitude: req.latitude, longitude: req.longitude }}
          anchor={{ x: 0.5, y: 1 }}
          tracksViewChanges={false}
          title={`${req.name} (pending)`}
        >
          <PendingMarker />
        </Marker>
      ))}
    </MapView>
  );
});
