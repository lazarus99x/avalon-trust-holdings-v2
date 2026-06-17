import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom bouncing marker icon
const upsIcon = L.divIcon({
  className: 'custom-ups-marker',
  html: `
    <div class="relative group">
      <div class="animate-bounce-slow">
        <div class="w-12 h-12 bg-ups-brown text-ups-yellow rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-sm"></div>
      </div>
    </div>
    <style>
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-bounce-slow {
        animation: bounce-slow 2s ease-in-out infinite;
      }
    </style>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

export const USAHomeMap: React.FC = () => {
  // Center of USA
  const position: [number, number] = [39.8283, -98.5795];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden grayscale-[20%] hover:grayscale-0 transition-all duration-700">
      <MapContainer
        center={position}
        zoom={4}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ zIndex: 1, background: '#f3f4f6' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Main UPS Center Pin */}
        <Marker position={position} icon={upsIcon}>
          <Popup className="ups-popup">
            <div className="p-2 min-w-[150px]">
              <h4 className="font-black text-ups-brown text-sm uppercase mb-1">ATH Logistics Center</h4>
              <p className="text-[10px] text-gray-500 font-medium">Main Hub - Central USA</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">ONLINE</span>
                <span className="text-[9px] font-bold text-ups-brown opacity-40">24/7 SUPPORT</span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Decorative subtle pulse for extra premium feel */}
        <Marker position={[34.0522, -118.2437]} icon={L.divIcon({ className: 'w-2 h-2 bg-ups-yellow/40 rounded-full animate-ping' })} />
        <Marker position={[40.7128, -74.0060]} icon={L.divIcon({ className: 'w-2 h-2 bg-ups-yellow/40 rounded-full animate-ping' })} />
      </MapContainer>
    </div>
  );
};
