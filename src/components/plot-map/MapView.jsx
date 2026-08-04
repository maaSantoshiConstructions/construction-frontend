import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

const makeIcon = L.divIcon({
  className: '',
  html: '<div className="w-5.5 h-5.5 rounded-full bg-blue-600 border-3 border-white shadow-md"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const selectedIcon = L.divIcon({
  className: '',
  html: '<div className="w-7 h-7 rounded-full bg-red-600 border-3 border-white shadow-lg"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function makeLandmarkIcon(emoji) {
  return L.divIcon({
    className: '',
    html: `<div className="w-6.5 h-6.5 rounded-lg bg-white border-2 border-slate-200 flex items-center justify-center text-xs shadow-xs">${emoji}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 0.8 });
  }, [center, map]);
  return null;
}

function getLandmarks(city) {
  const map = {
    Bhubaneswar: [
      { name: 'KIIT University', type: 'School', lat: 20.3524, lng: 85.8128, emoji: '🎓' },
      { name: 'AIIMS Bhubaneswar', type: 'Hospital', lat: 20.2532, lng: 85.7788, emoji: '🏥' },
      { name: 'NH-16 Bypass', type: 'Highway', lat: 20.3150, lng: 85.8120, emoji: '🛣️' },
      { name: 'Unit 4 Market', type: 'Market', lat: 20.2934, lng: 85.8245, emoji: '🛒' },
      { name: 'Kalinga Stadium', type: 'Landmark', lat: 20.2861, lng: 85.8020, emoji: '⚽' },
    ],
    Khordha: [
      { name: 'Khordha Town', type: 'Town', lat: 20.1822, lng: 85.6163, emoji: '🏛️' },
      { name: 'Khordha Hospital', type: 'Hospital', lat: 20.1830, lng: 85.6170, emoji: '🏥' },
      { name: 'NH-16', type: 'Highway', lat: 20.1750, lng: 85.6200, emoji: '🛣️' },
    ],
    Cuttack: [
      { name: 'SCB Medical College', type: 'Hospital', lat: 20.4867, lng: 85.8846, emoji: '🏥' },
      { name: 'Barabati Stadium', type: 'Landmark', lat: 20.4833, lng: 85.8668, emoji: '⚽' },
      { name: 'Nehru Bazaar', type: 'Market', lat: 20.4700, lng: 85.8800, emoji: '🛒' },
    ],
    Puri: [
      { name: 'Jagannath Temple', type: 'Landmark', lat: 19.8050, lng: 85.8181, emoji: '🛕' },
      { name: 'Puri Beach', type: 'Landmark', lat: 19.7983, lng: 85.8250, emoji: '🏖️' },
      { name: 'NH-16 Puri Road', type: 'Highway', lat: 19.8150, lng: 85.8200, emoji: '🛣️' },
    ],
  };
  return map[city] || [];
}

export default function MapView({
  filteredPlots,
  selectedPlot,
  setSelectedPlot,
  mapCenter,
  getProjectObj,
  getProjectCity,
  getProjectName,
}) {
  const uniqueCities = Array.from(new Set(filteredPlots.map((p) => getProjectCity(p)).filter(Boolean)));
  const allLandmarks = uniqueCities.flatMap((city) => getLandmarks(city));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-[600px] shadow-xs">
      <MapContainer center={mapCenter} zoom={12} className="w-full h-full" scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={mapCenter} />

        {filteredPlots
          .filter((p) => {
            const proj = getProjectObj(p);
            return p.coordinates?.lat || proj?.location?.coordinates?.lat;
          })
          .map((plot) => {
            const proj = getProjectObj(plot);
            const pos =
              plot.coordinates?.lat && plot.coordinates?.lng
                ? plot.coordinates
                : proj.location.coordinates;
            const sel = selectedPlot?._id === plot._id;
            return (
              <Marker
                key={plot._id}
                position={[pos.lat, pos.lng]}
                icon={sel ? selectedIcon : makeIcon}
                eventHandlers={{ click: () => setSelectedPlot(plot) }}
              >
                <Popup>
                  <div className="min-w-[180px] font-['Inter',sans-serif]">
                    <strong className="text-sm text-slate-900 font-bold block">
                      Plot {plot.plotNumber}
                    </strong>
                    <span className="text-xs text-slate-500 block">{getProjectName(plot)}</span>
                    <span className="text-xs text-slate-700 block">
                      {formatSize(plot.size)} sqft &middot; {plot.facing}
                    </span>
                    <strong className="text-sm font-extrabold text-amber-600 block mt-0.5">
                      {formatCurrency(plot.price)}
                    </strong>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {allLandmarks.map((lm, li) => (
          <Marker key={`lm-${li}`} position={[lm.lat, lm.lng]} icon={makeLandmarkIcon(lm.emoji)}>
            <Popup>
              <div className="font-['Inter',sans-serif]">
                <strong className="text-xs font-bold text-slate-900 block">{lm.name}</strong>
                <span className="text-[11px] text-slate-500 block">{lm.type}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
