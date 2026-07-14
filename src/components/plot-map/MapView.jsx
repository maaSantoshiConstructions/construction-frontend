import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');
const formatSize = (val) => (val || 0).toLocaleString('en-IN');

const makeIcon = L.divIcon({
  className: '',
  html: '<div style="width:22px;height:22px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const selectedIcon = L.divIcon({
  className: '',
  html: '<div style="width:28px;height:28px;border-radius:50%;background:#dc2626;border:3px solid #fff;box-shadow:0 2px 8px rgba(220,38,38,0.5)"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function makeLandmarkIcon(emoji) {
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:6px;background:#fff;border:2px solid #e5e7eb;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 1px 4px rgba(0,0,0,0.12)">${emoji}</div>`,
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
      { name: 'KIIT University', type: 'School', lat: 20.3524, lng: 85.8128, emoji: '\uD83C\uDF93' },
      { name: 'AIIMS Bhubaneswar', type: 'Hospital', lat: 20.2532, lng: 85.7788, emoji: '\uD83C\uDFE5' },
      { name: 'NH-16 Bypass', type: 'Highway', lat: 20.3150, lng: 85.8120, emoji: '\uD83D\uDEE3\uFE0F' },
      { name: 'Unit 4 Market', type: 'Market', lat: 20.2934, lng: 85.8245, emoji: '\uD83D\uDED2' },
      { name: 'Kalinga Stadium', type: 'Landmark', lat: 20.2861, lng: 85.8020, emoji: '\u26BD' },
    ],
    Khordha: [
      { name: 'Khordha Town', type: 'Town', lat: 20.1822, lng: 85.6163, emoji: '\uD83C\uDFDB\uFE0F' },
      { name: 'Khordha Hospital', type: 'Hospital', lat: 20.1830, lng: 85.6170, emoji: '\uD83C\uDFE5' },
      { name: 'NH-16', type: 'Highway', lat: 20.1750, lng: 85.6200, emoji: '\uD83D\uDEE3\uFE0F' },
    ],
    Cuttack: [
      { name: 'SCB Medical College', type: 'Hospital', lat: 20.4867, lng: 85.8846, emoji: '\uD83C\uDFE5' },
      { name: 'Barabati Stadium', type: 'Landmark', lat: 20.4833, lng: 85.8668, emoji: '\u26BD' },
      { name: 'Nehru Bazaar', type: 'Market', lat: 20.4700, lng: 85.8800, emoji: '\uD83D\uDED2' },
    ],
    Puri: [
      { name: 'Jagannath Temple', type: 'Landmark', lat: 19.8050, lng: 85.8181, emoji: '\uD83D\uDD4C' },
      { name: 'Puri Beach', type: 'Landmark', lat: 19.7983, lng: 85.8250, emoji: '\uD83C\uDFD6\uFE0F' },
      { name: 'NH-16 Puri Road', type: 'Highway', lat: 19.8150, lng: 85.8200, emoji: '\uD83D\uDEE3\uFE0F' },
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
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', height: '600px' }}>
      <MapContainer center={mapCenter} zoom={12} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapRecenter center={mapCenter} />
        {filteredPlots.filter((p) => {
          const proj = getProjectObj(p);
          return proj?.location?.coordinates?.lat;
        }).map((plot) => {
          const proj = getProjectObj(plot);
          const center = proj.location.coordinates;
          const city = getProjectCity(plot);
          const landmarks = getLandmarks(city);
          const sel = selectedPlot?._id === plot._id;
          return (
            <React.Fragment key={plot._id}>
              <Marker
                position={[center.lat, center.lng]}
                icon={sel ? selectedIcon : makeIcon}
                eventHandlers={{ click: () => setSelectedPlot(plot) }}
              >
                <Popup>
                  <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '180px' }}>
                    <strong style={{ fontSize: '14px' }}>Plot {plot.plotNumber}</strong><br />
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{getProjectName(plot)}</span><br />
                    <span style={{ fontSize: '12px' }}>{formatSize(plot.size)} sqft &middot; {plot.facing}</span><br />
                    <strong style={{ color: '#d97706' }}>{formatCurrency(plot.price)}</strong>
                  </div>
                </Popup>
              </Marker>
              {landmarks.map((lm, li) => (
                <Marker key={li} position={[lm.lat, lm.lng]} icon={makeLandmarkIcon(lm.emoji)}>
                  <Popup><span style={{ fontFamily: 'Inter, sans-serif' }}><strong>{lm.name}</strong><br />{lm.type}</span></Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
