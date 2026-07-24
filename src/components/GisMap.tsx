import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../hooks/useStore';
import { SPNREC_CENTER } from '../services/supabaseClient';
import type { CampusBuilding, Sensor, Complaint, ActiveStaffLocation } from '../types/database';

interface GisMapProps {
  onSelectCoordinates?: (coords: { lat: number; lng: number; locationName: string }) => void;
  selectedTicketCoords?: { lat: number; lng: number } | null;
  interactive?: boolean;
}

export const GisMap: React.FC<GisMapProps> = ({ 
  onSelectCoordinates, 
  selectedTicketCoords, 
  interactive = true 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerGroup = useRef<L.LayerGroup | null>(null);
  
  const { sensors, complaints, activeStaff } = useStore();
  
  // Custom SVG Markers to bypass missing asset imports in Vite/Leaflet
  const createBuildingIcon = (name: string) => {
    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-400">
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
            </svg>
          </div>
          <div class="absolute top-7 bg-slate-950/90 text-white text-[9px] font-medium px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap pointer-events-none">
            ${name}
          </div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const createSensorIcon = (sensor: Sensor) => {
    const statusColor = 
      sensor.status === 'CRITICAL' ? 'red' : 
      sensor.status === 'WARNING' ? 'amber' : 'emerald';
      
    const hexColor = 
      sensor.status === 'CRITICAL' ? '#ef4444' : 
      sensor.status === 'WARNING' ? '#f59e0b' : '#10b981';

    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <!-- Pulse rings for anomalies -->
          ${sensor.status !== 'HEALTHY' ? `
            <div class="absolute w-8 h-8 rounded-full border border-${statusColor}-500 animate-ping opacity-60"></div>
            <div class="absolute w-6 h-6 rounded-full bg-${statusColor}-500/20 animate-pulse"></div>
          ` : ''}
          <div class="w-5 h-5 rounded-full bg-slate-900 border-2 border-${statusColor}-500 flex items-center justify-center shadow-md">
            <div class="w-2 h-2 rounded-full" style="background-color: ${hexColor}"></div>
          </div>
          <div class="absolute top-6 bg-slate-900/90 text-${statusColor}-400 text-[8px] font-mono px-1 rounded border border-slate-700 whitespace-nowrap pointer-events-none">
            ${sensor.name.split(' ')[1] || sensor.name} (${sensor.last_reading}${sensor.unit})
          </div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const createComplaintIcon = (complaint: Complaint) => {
    const priorityColor = 
      complaint.priority === 'CRITICAL' ? 'red' : 
      complaint.priority === 'HIGH' ? 'orange' : 'yellow';

    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full border border-${priorityColor}-500 animate-ping opacity-40"></div>
          <div class="w-6 h-6 rounded-full bg-${priorityColor}-500 border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
  };

  const createStaffIcon = (staff: ActiveStaffLocation) => {
    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full border border-purple-500 animate-ping opacity-40"></div>
          <div class="w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center shadow-lg transition-transform duration-1000">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="absolute top-7 bg-slate-900/90 text-purple-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap pointer-events-none">
            ${staff.name.split(' ')[0]} (${staff.status})
          </div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // 1. Initialize Map
    const map = L.map(mapRef.current, {
      center: [SPNREC_CENTER.lat, SPNREC_CENTER.lng],
      zoom: 17,
      zoomControl: interactive,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      attributionControl: false
    });

    leafletMap.current = map;

    // 2. Add Tile Layers (Dark Blueprint & Real Satellite View)
    const darkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    });

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    // Add default dark blueprint to map
    darkMatter.addTo(map);

    // Add layer switch controls if interactive
    if (interactive) {
      const baseMaps = {
        "Dark Blueprint": darkMatter,
        "Satellite View": satellite
      };
      L.control.layers(baseMaps, {}, { position: 'topleft' }).addTo(map);
    }

    // 3. Add Marker Group Layer
    const group = L.layerGroup().addTo(map);
    markerGroup.current = group;

    // 4. Map click handler for coordinates picker
    if (interactive && onSelectCoordinates) {
      map.on('click', (e: any) => {
        // Reverse geocoding placeholder: find closest building
        const clickLat = e.latlng.lat;
        const clickLng = e.latlng.lng;
        
        const buildings: CampusBuilding[] = JSON.parse(localStorage.getItem('gv_buildings') || '[]');
        let closestBuilding = 'SPNREC Open Ground';
        let minDist = 999999;
        
        if (buildings.length > 0) {
          buildings.forEach(b => {
            const dist = Math.sqrt(Math.pow(b.latitude - clickLat, 2) + Math.pow(b.longitude - clickLng, 2));
            if (dist < minDist) {
              minDist = dist;
              closestBuilding = `Near ${b.name}`;
            }
          });
        } else {
          closestBuilding = `Custom Map Point (${clickLat.toFixed(4)}, ${clickLng.toFixed(4)})`;
        }

        onSelectCoordinates({ lat: clickLat, lng: clickLng, locationName: closestBuilding });
      });
    }

    return () => {
      map.remove();
    };
  }, []);

  // Update Markers when store state changes
  useEffect(() => {
    const map = leafletMap.current;
    const group = markerGroup.current;
    if (!map || !group) return;

    // Clear previous markers
    group.clearLayers();

    // 1. Render Buildings
    const buildings: CampusBuilding[] = JSON.parse(localStorage.getItem('gv_buildings') || '[]');
    buildings.forEach(b => {
      const marker = L.marker([b.latitude, b.longitude], { icon: createBuildingIcon(b.name) });
      marker.bindPopup(`
        <div class="p-1">
          <h4 class="font-bold text-sm text-cyan-400 mb-1">${b.name}</h4>
          <p class="text-xs text-slate-300">${b.description}</p>
          <div class="mt-2 text-[10px] text-slate-500 font-mono">CODE: SPNREC-${b.code}</div>
        </div>
      `);
      group.addLayer(marker);
    });

    // 2. Render Live Sensors
    sensors.forEach(s => {
      const marker = L.marker([s.latitude, s.longitude], { icon: createSensorIcon(s) });
      const statusClass = s.status === 'CRITICAL' ? 'text-red-500 font-bold' : s.status === 'WARNING' ? 'text-amber-500' : 'text-emerald-500';
      
      marker.bindPopup(`
        <div class="p-1">
          <div class="flex justify-between items-center mb-1">
            <h4 class="font-bold text-sm text-white">${s.name}</h4>
            <span class="text-[9px] uppercase px-1 rounded bg-slate-800 ${statusClass}">${s.status}</span>
          </div>
          <p class="text-xs text-slate-300">Location: ${s.location}</p>
          <div class="flex justify-between items-center mt-2 pt-2 border-t border-slate-800">
            <span class="text-xs font-mono text-slate-400">Value: ${s.last_reading} ${s.unit}</span>
            <span class="text-xs font-mono text-slate-400">Battery: ${s.battery}%</span>
          </div>
          ${s.status !== 'HEALTHY' ? `
            <button onclick="window.dispatchEvent(new CustomEvent('map-report-issue', {detail: {sensorId: '${s.id}', location: '${s.location}', type: '${s.type}'}}))" 
                    class="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] py-1 rounded transition text-center cursor-pointer">
              Report Issue
            </button>
          ` : ''}
        </div>
      `);
      group.addLayer(marker);
    });

    // 3. Render Unresolved and Unverified Complaints
    complaints.filter(c => c.status !== 'RESOLVED' || !c.verified).forEach(c => {
      const marker = L.marker([c.latitude, c.longitude], { icon: createComplaintIcon(c) });
      const statusText = c.status === 'RESOLVED' && !c.verified ? 'RESOLVED (AWAITING VERIFICATION)' : c.status;
      marker.bindPopup(`
        <div class="p-1">
          <div class="flex justify-between items-center mb-1">
            <h4 class="font-bold text-xs text-red-400 truncate max-w-[140px]">${c.title}</h4>
            <span class="text-[9px] px-1 rounded bg-red-950/80 text-red-400 border border-red-900 uppercase">${c.priority}</span>
          </div>
          <p class="text-[11px] text-slate-300 mb-1">${c.description}</p>
          <div class="text-[10px] text-slate-500 font-medium">Status: <span class="text-slate-300 font-semibold">${statusText}</span></div>
          <div class="mt-2 text-[9px] text-slate-600">Reported by: ${c.reporter_name}</div>
        </div>
      `);
      group.addLayer(marker);
    });

    // 4. Render Active Staff Locations
    activeStaff.forEach(staff => {
      const marker = L.marker([staff.latitude, staff.longitude], { icon: createStaffIcon(staff) });
      marker.bindPopup(`
        <div class="p-1">
          <h4 class="font-bold text-sm text-purple-400 mb-1">${staff.name}</h4>
          <p class="text-[10px] text-slate-300 mb-1">Role: ${staff.role}</p>
          <div class="text-[10px] text-slate-500 font-medium">Status: <span class="text-white font-semibold">${staff.status}</span></div>
        </div>
      `);
      group.addLayer(marker);
    });

  }, [sensors, complaints, activeStaff]);

  // Center map on selected complaint marker if coordinates provided
  useEffect(() => {
    const map = leafletMap.current;
    if (!map || !selectedTicketCoords) return;
    map.setView([selectedTicketCoords.lat, selectedTicketCoords.lng], 19, { animate: true });
  }, [selectedTicketCoords]);

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-brand-border shadow-2xl glass-panel">
      {/* Map Target Div */}
      <div ref={mapRef} className="w-full h-full z-0" />
      
      {/* HUD overlays */}
      <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-lg border border-brand-border text-[11px] text-slate-400 font-mono z-10 pointer-events-none flex flex-col gap-1 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block border border-cyan-400"></span>
          <span>SPNREC Buildings</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block border border-emerald-400"></span>
          <span>IoT Sensors (Healthy)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block border border-amber-400 animate-pulse"></span>
          <span>IoT Warnings</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block border border-red-400 animate-ping"></span>
          <span>IoT Critical / Active Issues</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-purple-600 inline-block border border-white"></span>
          <span>Live Maintenance Staff</span>
        </div>
      </div>
      
      {interactive && (
        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-brand-border text-[10px] text-slate-300 font-semibold z-10 pointer-events-none shadow-md">
          GIS Live Radar Centered
        </div>
      )}
    </div>
  );
};
export default GisMap;
