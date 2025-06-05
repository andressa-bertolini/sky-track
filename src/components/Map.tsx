'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const mockFlights = [
  { id: 1, coords: [-46.6333, -23.5505] },
  { id: 2, coords: [-74.006, 40.7128] },
  { id: 3, coords: [2.3522, 48.8566] },
];

export default function LiveMap() {
  const mapContainer = useRef(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapInstance.current) return;
  
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
      center: [0, 0],
      zoom: 1.5,
    });
  
    mapInstance.current = map;  // Atribui aqui
  
    map.on('load', () => {
      mockFlights.forEach((flight) => {
        const el = document.createElement('div');
        el.className = 'airplane-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundImage = 'url("/icons/airplane.svg")';
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
  
        new maplibregl.Marker({ element: el })
          .setLngLat(flight.coords)
          .addTo(map);
      });
    });
  
    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return <div ref={mapContainer} className="h-full w-full" />;
}