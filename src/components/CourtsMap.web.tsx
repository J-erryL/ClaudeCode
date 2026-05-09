import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { CourtMarker } from './CourtMarker';
import { colors } from '@/theme/colors';
import type { Court, CourtRequest } from '@/types';
import 'leaflet/dist/leaflet.css';

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

const SYDNEY_CENTER: [number, number] = [-33.885, 151.215];

function bubbleHtml(court: Court, count: number, selected: boolean) {
  const tint = court.type === 'indoor' ? colors.indoor : colors.outdoor;
  const scale = selected ? 1.15 : 1;
  const badge =
    count > 0
      ? `<div style="position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:#0F172A;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;border:1.5px solid #fff;box-sizing:border-box;">${count}</div>`
      : '';
  return `
    <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-100%);">
      <div style="position:relative;width:40px;height:40px;border-radius:50%;background:${tint};display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);transform:scale(${scale});font-size:20px;line-height:1;">
        🏀${badge}
      </div>
      <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${tint};margin-top:-2px;"></div>
    </div>
  `;
}

function pendingHtml() {
  return `
    <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-100%);">
      <div style="width:36px;height:36px;border-radius:50%;background:${colors.textMuted};display:flex;align-items:center;justify-content:center;border:2px dashed #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25);font-size:18px;font-weight:800;color:#fff;line-height:1;">?</div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid ${colors.textMuted};margin-top:-2px;"></div>
    </div>
  `;
}

function MapController({
  exposeFocus,
  onMapPress,
}: {
  exposeFocus: (focus: (lat: number, lng: number) => void) => void;
  onMapPress?: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  useEffect(() => {
    exposeFocus((lat, lng) => {
      map.flyTo([lat - 0.003, lng], 15, { duration: 0.6 });
    });
  }, [map, exposeFocus]);

  useEffect(() => {
    const handler = () => map.invalidateSize();
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [map]);

  useEffect(() => {
    if (!onMapPress) return;
    const handler = (e: L.LeafletMouseEvent) => {
      const target = e.originalEvent?.target as HTMLElement | null;
      if (target?.closest('.leaflet-marker-icon')) return;
      onMapPress(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handler);
    return () => {
      map.off('click', handler);
    };
  }, [map, onMapPress]);

  return null;
}

function ClickAway({ onClick }: { onClick: () => void }) {
  const map = useMap();
  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      const target = e.originalEvent?.target as HTMLElement | null;
      if (target?.closest('.leaflet-marker-icon')) return;
      onClick();
    };
    map.on('click', handler);
    return () => {
      map.off('click', handler);
    };
  }, [map, onClick]);
  return null;
}

export const CourtsMap = forwardRef<CourtsMapHandle, CourtsMapProps>(function CourtsMap(
  { courts, pendingRequests, selectedId, sessionCounts, onSelect, onDeselect, onMapPress },
  ref,
) {
  const focusRef = useRef<(lat: number, lng: number) => void>(() => {});

  useImperativeHandle(ref, () => ({
    focusCourt: (lat, lng) => focusRef.current(lat, lng),
  }));

  const courtIcons = useMemo(() => {
    const m: Record<string, L.DivIcon> = {};
    for (const court of courts) {
      const html = renderToStaticMarkup(
        <div
          dangerouslySetInnerHTML={{
            __html: bubbleHtml(court, sessionCounts[court.id] ?? 0, selectedId === court.id),
          }}
        />,
      );
      m[court.id] = L.divIcon({
        html,
        className: 'rally-marker',
        iconSize: [40, 50],
        iconAnchor: [20, 50],
      });
    }
    return m;
  }, [courts, sessionCounts, selectedId]);

  const pendingIcon = useMemo(
    () =>
      L.divIcon({
        html: renderToStaticMarkup(<div dangerouslySetInnerHTML={{ __html: pendingHtml() }} />),
        className: 'rally-marker',
        iconSize: [36, 45],
        iconAnchor: [18, 45],
      }),
    [],
  );

  return (
    <div style={{ position: 'absolute', inset: 0, cursor: onMapPress ? 'crosshair' : 'auto' }}>
      <MapContainer
        center={SYDNEY_CENTER}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
        />
        <MapController exposeFocus={(fn) => (focusRef.current = fn)} onMapPress={onMapPress} />
        {courts.map((court) => (
          <Marker
            key={court.id}
            position={[court.latitude, court.longitude]}
            icon={courtIcons[court.id]}
            bubblingMouseEvents={false}
            eventHandlers={{
              click: () => {
                if (onMapPress) return;
                onSelect(court.id);
              },
            }}
          />
        ))}
        {pendingRequests.map((req) => (
          <Marker
            key={req.id}
            position={[req.latitude, req.longitude]}
            icon={pendingIcon}
            interactive={false}
          />
        ))}
        {!onMapPress && <ClickAway onClick={onDeselect} />}
      </MapContainer>
    </div>
  );
});
