import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const plotsData = [
  { id: 'A-12', lat: 20.2975, lng: 85.8238, status: 'available', size: '2400', price: '58.8', facing: 'North' },
  { id: 'A-19', lat: 20.2968, lng: 85.8252, status: 'available', size: '1800', price: '44.1', facing: 'East' },
  { id: 'B-03', lat: 20.2959, lng: 85.8241, status: 'reserved', size: '3200', price: '95.2', facing: 'North-East' },
  { id: 'A-42', lat: 20.2964, lng: 85.8232, status: 'available', size: '2400', price: '58.8', facing: 'North' },
  { id: 'C-07', lat: 20.2971, lng: 85.8258, status: 'sold', size: '1500', price: '36.75', facing: 'West' },
];

const statusColors = { available: '#22c55e', reserved: '#eab308', sold: '#ef4444' };

export default function PlotMapModal({ onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [bookingForm, setBookingForm] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (typeof L === 'undefined' || mapInstanceRef.current) return;

    const initMap = () => {
      const mapContainer = mapRef.current;
      if (!mapContainer) return;

      mapInstanceRef.current = L.map(mapContainer).setView([20.2961, 85.8245], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      plotsData.forEach(plot => {
        const color = statusColors[plot.status] || '#22c55e';
        const marker = L.circleMarker([plot.lat, plot.lng], {
          radius: 11,
          fillColor: color,
          color: '#fff',
          weight: 2,
          fillOpacity: 0.9
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <strong>Plot ${plot.id}</strong><br>
          ${plot.size} sq.ft • ${plot.facing} facing<br>
          ₹${plot.price} Lakh<br>
          <span style="color:${color}">${plot.status.toUpperCase()}</span>
        `);

        marker.on('click', () => setSelectedPlot(plot));
      });

      L.rectangle([[20.2952, 85.8225], [20.2983, 85.8265]], {
        color: "#64748b", weight: 1, fillOpacity: 0.05
      }).addTo(mapInstanceRef.current);
    };

    // Wait for Leaflet to be available
    const checkLeaflet = setInterval(() => {
      if (typeof L !== 'undefined') {
        clearInterval(checkLeaflet);
        initMap();
      }
    }, 100);

    return () => {
      clearInterval(checkLeaflet);
    };
  }, []);

  useEffect(() => {
    // Invalidate map size when modal opens (for proper rendering)
    if (mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current.invalidateSize(), 300);
    }
  }, []);

  const completeBooking = (plotId) => {
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setBookingForm(null);
      setSelectedPlot(null);
      toast.success(`🎉 Congratulations! Plot ${plotId} has been successfully booked.\n\nBooking ID: JSM-2026-${Math.floor(Math.random() * 90000) + 10000}`);
    }, 1350);
  };

  if (bookingForm) {
    return (
      <div onClick={(e) => { if (e.target === e.currentTarget) { setBookingForm(null); } }}
        className="fixed inset-0 bg-black/70 z-[120] flex items-center justify-center p-4">
        <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-3xl p-7 shadow-2xl"
          style={{ animation: 'modalPopIn 0.3s ease forwards' }}>
          <div className="font-bold text-xl text-slate-800">Confirm Booking for Plot {bookingForm}</div>
          <div className="mt-4 text-sm text-slate-600">Token amount: ₹25,000 (adjustable)</div>
          <div className="mt-5 space-y-3 text-sm">
            <input defaultValue="Debasis Patra" placeholder="Full Name" className="w-full border px-4 py-2.5 rounded-2xl" />
            <input defaultValue="+91 98765 43210" placeholder="Phone Number" className="w-full border px-4 py-2.5 rounded-2xl" />
            <input defaultValue="debasis@example.com" placeholder="Email" className="w-full border px-4 py-2.5 rounded-2xl" />
          </div>
          <button onClick={() => completeBooking(bookingForm)} disabled={bookingLoading}
            className="mt-5 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-3xl flex items-center justify-center gap-2 disabled:opacity-70">
            {bookingLoading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> PROCESSING...</> : 'PAY TOKEN & BOOK INSTANTLY'}
          </button>
          <div className="text-center text-[10px] mt-2 text-slate-500">Instant receipt + agreement will be generated</div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'modalPopIn 0.3s ease forwards' }}>
        <div className="px-8 py-5 border-b flex justify-between items-center">
          <div>
            <span className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-2xl">FEATURE 03</span>
            <span className="ml-3 font-bold text-xl text-slate-800">Live Plot Availability Map — Santoshi Enclave</span>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-x-1.5"><span className="inline-block w-3 h-3 bg-emerald-500 rounded-full"></span> <span className="text-xs">Available (142)</span></div>
              <div className="flex items-center gap-x-1.5"><span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span> <span className="text-xs">Reserved (31)</span></div>
              <div className="flex items-center gap-x-1.5"><span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span> <span className="text-xs">Sold (87)</span></div>
            </div>
            <div className="text-xs text-slate-500">Last updated: Just now • Click any plot to view details</div>
          </div>

          <div ref={mapRef} className="w-full h-[420px] bg-slate-100 rounded-2xl overflow-hidden" style={{ borderRadius: '16px' }} />

          {selectedPlot && (
            <div className="mt-4 p-4 bg-slate-50 border rounded-2xl text-sm">
              <div className="flex justify-between">
                <div>
                  <div className="font-bold text-lg text-slate-800">Plot {selectedPlot.id} • {selectedPlot.facing} Facing</div>
                  <div className="text-slate-600">{selectedPlot.size} sq.ft • Santoshi Enclave Phase 1 • {selectedPlot.status.toUpperCase()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-emerald-700">₹{selectedPlot.price} Lakh</div>
                  <button onClick={() => setBookingForm(selectedPlot.id)}
                    className="mt-1 px-5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold">
                    BOOK THIS PLOT INSTANTLY
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
