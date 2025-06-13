'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '../store';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Flight } from '../types/flights';


export default function LiveMap() {
  const { flights, loading } = useAppSelector((state) => state.flights);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const addFlightMarkers = useCallback((map: maplibregl.Map, flightsData: Flight[]) => {
    clearMarkers();
  
    const validFlights = flightsData.filter(
      (flight) =>
        flight.longitude !== null &&
        flight.latitude !== null &&
        flight.longitude !== undefined &&
        flight.latitude !== undefined
    );
  
    validFlights.forEach((flight) => {
      const el = document.createElement('div');
      el.className = 'airplane-marker';
      el.style.width = '15px';
      el.style.height = '15px';
      el.style.backgroundImage = 'url("/icons/airplane.svg")';
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.cursor = 'pointer';
  
      if (flight.true_track !== null && flight.true_track !== undefined) {
        el.style.transform = `rotate(${flight.true_track}deg)`;
      }
  
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false
      }).setHTML(`
        <div class="flight-popup">
          <h3 style="margin: 0 0 2px 0; font-weight: bold; color: #333;">
            ${flight.callsign || flight.icao24}
          </h3>
          <div style="font-size: 12px; color: #666;">
            <p style="margin: 0">
              ${flight.origin_country}
              &nbsp;→&nbsp;
              Australia
            </p>
          </div>
        </div>
      `);
  
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([flight.longitude!, flight.latitude!])
        .addTo(map);
  
      el.addEventListener('mouseenter', () => {
        popup.setLngLat([flight.longitude!, flight.latitude!]).addTo(map);
      });
  
      el.addEventListener('mouseleave', () => {
        popup.remove();
      });
  
      markersRef.current.push(marker);
    });
  }, []);

  useEffect(() => {
    if (mapInstance.current) return;
  
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`,
      center: [0, 0],
      zoom: 1.5,
      pitch: 0,
      bearing: 0
    });
  
    mapInstance.current = map;
  
    map.on('load', () => {
      if (flights && flights.length > 0) {
        addFlightMarkers(map, flights);
      }
    });
  
    return () => {
      clearMarkers();
      map.remove();
      mapInstance.current = null;
    };
  }, [addFlightMarkers, flights]);

  useEffect(() => {
    if (!mapInstance.current || !flights) return;
  
    if (mapInstance.current.loaded()) {
      addFlightMarkers(mapInstance.current, flights);
    } else {
      mapInstance.current.on('load', () => {
        addFlightMarkers(mapInstance.current!, flights);
      });
    }
  }, [flights, addFlightMarkers]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      
      {loading && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
          Loading...
        </div>
      )}
    </div>
  );
}