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
      console.log(flight);
      const el = document.createElement('div');
      el.className = 'airplane-marker';
      el.style.width = '15px';
      el.style.height = '15px';
      el.style.backgroundImage = 'url("/icons/airplane.svg")';
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.cursor = 'pointer';
  
      if (flight.heading !== null && flight.heading !== undefined) {
        el.style.transform = `rotate(${flight.heading}deg)`;
      }
  
      const originText = flight.origin?.airport 
        ? `${flight.origin.airport} (${flight.origin.iata || flight.origin.icao})`
        : flight.origin?.iata || flight.origin?.icao || 'Unknown';
      
      const destinationText = flight.destination?.airport
        ? `${flight.destination.airport} (${flight.destination.iata || flight.destination.icao})`
        : flight.destination?.iata || flight.destination?.icao || 'Unknown';

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false
      }).setHTML(`
        <div class="flight-popup" style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #333; font-size: 14px;">
            ${flight.callsign || flight.icao24}
          </h3>
          
          <div style="font-size: 12px; color: #666; line-height: 1.6;">
            ${flight.airline ? `<p style="margin: 0 0 6px 0; color: #444;"><strong>${flight.airline}</strong></p>` : ''}
            
            <div style="margin: 4px 0;">
              <span style="color: #22c55e;">📍 From:</span><br/>
              <span style="padding-left: 16px;">${originText}</span>
            </div>
            
            <div style="margin: 4px 0;">
              <span style="color: #3b82f6;">🛬 To:</span><br/>
              <span style="padding-left: 16px;">${destinationText}</span>
            </div>
            
            ${flight.altitude ? `
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #eee;">
                <span style="color: #888;">Altitude: ${Math.round(flight.altitude)}m</span>
                ${flight.velocity ? ` • <span style="color: #888;">Speed: ${Math.round(flight.velocity)} km/h</span>` : ''}
              </div>
            ` : ''}
            
            ${flight.status ? `
              <div style="margin-top: 4px;">
                <span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px; color: #666;">
                  ${flight.status}
                </span>
              </div>
            ` : ''}
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
          Loading flights...
        </div>
      )}
      
      {!loading && flights && flights.length === 0 && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
          No active flights found
        </div>
      )}
    </div>
  );
}