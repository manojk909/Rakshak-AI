'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, forwardRef } from 'react';
import { Plus, Minus, Maximize2, LocateFixed } from 'lucide-react';
import { getHeatmap } from '@/lib/api';
import { DEMO_HEATMAP } from '@/lib/demoData';

// Mapbox GL JS requires window — load client-side only
const Map = dynamic(
  () => import('react-map-gl').then((m) => {
    const MapComp = m.Map;
    const Wrapped = forwardRef((props: any, ref: any) => <MapComp {...props} ref={ref} />);
    Wrapped.displayName = 'MapWrapper';
    return Wrapped;
  }),
  { ssr: false }
);
const Source = dynamic(() => import('react-map-gl').then((m) => m.Source as any), { ssr: false }) as any;
const Layer = dynamic(() => import('react-map-gl').then((m) => m.Layer as any), { ssr: false }) as any;

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const INITIAL_VIEW = { latitude: 20.5937, longitude: 78.9629, zoom: 4.2 };

const heatmapLayer: any = {
  id: 'crime-heat', type: 'heatmap', maxzoom: 10,
  paint: {
    'heatmap-weight': ['match', ['get', 'severity'], 'critical', 1, 'high', 0.7, 0.4],
    'heatmap-intensity': 1.2,
    'heatmap-color': [
      'interpolate', ['linear'], ['heatmap-density'],
      0, 'rgba(0,0,0,0)', 0.2, '#1e3a8a', 0.4, '#3b82f6', 0.6, '#f59e0b', 0.85, '#ef4444',
    ],
    'heatmap-radius': 22,
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
  },
};

const circleLayer: any = {
  id: 'crime-points', type: 'circle', minzoom: 6,
  paint: {
    'circle-color': ['match', ['get', 'crime_type'],
      'victim_cluster', '#3b82f6', 'mule_withdrawal', '#f59e0b', 'fraud_compound', '#ef4444', '#94a3b8'],
    'circle-radius': ['match', ['get', 'crime_type'], 'fraud_compound', 9, 5],
    'circle-stroke-width': 1,
    'circle-stroke-color': '#0f172a',
    'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 9, 1],
  },
};

const LEGEND = [
  { color: '#3b82f6', label: 'Victim Cluster' },
  { color: '#f59e0b', label: 'Mule Withdrawal' },
  { color: '#ef4444', label: 'Fraud Compound' },
];

export default function LiveIncidentMap({ focus }: { focus: { lat: number; lng: number } | null }) {
  const [geojson, setGeojson] = useState<any>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    getHeatmap().then(setGeojson).catch(() => setGeojson(DEMO_HEATMAP));
  }, []);

  useEffect(() => {
    if (focus && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: [focus.lng, focus.lat], zoom: 10, duration: 1800 });
    }
  }, [focus]);

  // Store the underlying mapbox-gl map instance
  const onMapLoad = useCallback((evt: any) => {
    mapInstanceRef.current = evt.target;
  }, []);

  const zoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn({ duration: 300 });
    else setViewState((v) => ({ ...v, zoom: Math.min(v.zoom + 1, 18) }));
  };
  const zoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut({ duration: 300 });
    else setViewState((v) => ({ ...v, zoom: Math.max(v.zoom - 1, 1) }));
  };
  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude], zoom: INITIAL_VIEW.zoom, duration: 1200 });
    } else {
      setViewState(INITIAL_VIEW);
    }
  };
  const locateCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: [77.2090, 28.6139], zoom: 8, duration: 1200 });
    } else {
      setViewState({ latitude: 28.6139, longitude: 77.2090, zoom: 8 });
    }
  };

  if (!TOKEN) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0a] text-white/40 text-sm font-mono p-8 text-center">
        Set NEXT_PUBLIC_MAPBOX_TOKEN to render the live incident map
        <br />(mapbox://styles/mapbox/dark-v11)
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <Map
        mapboxAccessToken={TOKEN}
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        onLoad={onMapLoad}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        attributionControl={true}
        customAttribution="© RAKSHAK AI"
      >
        {geojson && (
          <Source id="crime" type="geojson" data={geojson}>
            <Layer {...heatmapLayer} />
            <Layer {...circleLayer} />
          </Source>
        )}
      </Map>

      {/* Map Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button onClick={zoomIn} className="w-9 h-9 bg-black/70 backdrop-blur border border-white/20 hover:border-[#ccff00] rounded-lg flex items-center justify-center text-white/80 hover:text-[#ccff00] transition-colors" title="Zoom in">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={zoomOut} className="w-9 h-9 bg-black/70 backdrop-blur border border-white/20 hover:border-[#ccff00] rounded-lg flex items-center justify-center text-white/80 hover:text-[#ccff00] transition-colors" title="Zoom out">
          <Minus className="w-4 h-4" />
        </button>
        <button onClick={resetView} className="w-9 h-9 bg-black/70 backdrop-blur border border-white/20 hover:border-[#ccff00] rounded-lg flex items-center justify-center text-white/80 hover:text-[#ccff00] transition-colors" title="Reset view">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button onClick={locateCenter} className="w-9 h-9 bg-black/70 backdrop-blur border border-white/20 hover:border-[#ccff00] rounded-lg flex items-center justify-center text-white/80 hover:text-[#ccff00] transition-colors" title="Focus Delhi NCR">
          <LocateFixed className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-3 bg-black/70 backdrop-blur border border-white/10 rounded-lg p-3 space-y-1.5 z-10">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-[10px] font-mono text-white/70">
            <span
              className={`w-2.5 h-2.5 rounded-full ${l.label === 'Fraud Compound' ? 'pulse-ring' : ''}`}
              style={{ background: l.color }}
            />
            {l.label}
          </div>
        ))}
      </div>
      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/70 z-10">
        Live Incident Map · India Grid
      </div>
    </div>
  );
}
