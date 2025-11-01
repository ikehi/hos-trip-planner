import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useEffect, useMemo } from 'react';

type RouteData = {
  map_geojson?: any;
  stops?: { label: string; lat: number; lon: number }[];
};

type Props = { routeData?: RouteData };

// Ensure Leaflet default marker icons resolve correctly on Vercel
// (Vercel doesn't serve the images at root by default)
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function FitBounds({ geojson }: { geojson: any }) {
  const map = useMap();
  useEffect(() => {
    if (!geojson) return;
    try {
      const coords: [number, number][] = [];
      const features = geojson.features || [];
      for (const f of features) {
        const g = f.geometry;
        if (!g) continue;
        if (g.type === 'LineString') coords.push(...g.coordinates.map(([lng, lat]: number[]) => [lat, lng] as [number, number]));
        if (g.type === 'MultiLineString') g.coordinates.forEach((line: number[][]) => coords.push(...line.map(([lng, lat]: number[]) => [lat, lng] as [number, number])));
      }
      if (coords.length) {
        const south = Math.min(...coords.map(c => c[0]));
        const west = Math.min(...coords.map(c => c[1]));
        const north = Math.max(...coords.map(c => c[0]));
        const east = Math.max(...coords.map(c => c[1]));
        map.fitBounds([[south, west], [north, east]] as [[number, number], [number, number]], { padding: [30, 30] });
      }
    } catch {}
  }, [geojson, map]);
  return null;
}

export default function MapDisplay({ routeData }: Props) {
  const center: [number, number] = useMemo(() => {
    const first = routeData?.stops?.[0];
    return (first ? [first.lat, first.lon] : [39.5, -98.35]) as [number, number];
  }, [routeData]);
  return (
    <div className="h-[28rem] w-full rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
      <div className="absolute z-10 m-3 rounded-lg bg-white/80 backdrop-blur px-3 py-2 text-xs text-gray-700">
        <div className="font-semibold mb-1">Legend</div>
        <div>• Route (GeoJSON)</div>
        <div>• Markers: Current / Pickup / Dropoff</div>
      </div>
      <MapContainer center={center} zoom={4} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {routeData?.map_geojson && (
          <>
            <GeoJSON data={routeData.map_geojson as any} />
            <FitBounds geojson={routeData.map_geojson} />
          </>
        )}
        {routeData?.stops?.map((s, i) => (
          <Marker key={i} position={[s.lat, s.lon]}>
            <Popup>
              <div className="font-semibold">{s.label}</div>
              <div className="text-xs text-gray-600">{s.lat.toFixed(4)}, {s.lon.toFixed(4)}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
