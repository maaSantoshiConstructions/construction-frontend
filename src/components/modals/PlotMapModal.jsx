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
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      plotsData.forEach((plot) => {
        const marker = L.circleMarker([plot.lat, plot.lng], {
          radius: 14,
          fillColor: statusColors[plot.status],
          color: '#fff',
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.8,
        }).addTo(mapInstanceRef.current);

        marker.bindTooltip(plot.id, { permanent: false, direction: 'top' });
        marker.on('click', () => setSelectedPlot(plot));
      });
    };

    const timeout = setTimeout(initMap, 200);
    return () => { clearTimeout(timeout); };
  }, []);

  const handleInstantBooking = () => {
    if (!selectedPlot) return;
    setBookingForm(true);
  };

  const confirmBooking = () => {
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      toast.success(`Plot ${selectedPlot.id} has been tentatively booked! Our team will contact you within 10 minutes.`);
      setBookingForm(false);
      setSelectedPlot(null);
      onClose();
    }, 800);
  };

  if (bookingForm) {
    return (
      <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
        <div onClick={(e) => e.stopPropagation()}
          className="modal bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
          <div className="font-bold text-xl text-slate-800 mb-4">Confirm Instant Booking</div>
          <div className="text-sm text-slate-500 mb-6">
            You are about to book <strong className="text-slate-700">Plot {selectedPlot?.id}</strong> ({selectedPlot?.size} sq.ft, {selectedPlot?.facing} facing) for <strong className="text-slate-700">₹{selectedPlot?.price} Lakh</strong>.
          </div>
          <div className="flex gap-3">
            <button onClick={() => setBookingForm(false)}
              className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            <button onClick={confirmBooking} disabled={bookingLoading}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
              {bookingLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="modal bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">FEATURE 03</span>
            <span className="ml-3 font-bold text-xl text-slate-800">Live Plot Availability Map — Santoshi Enclave</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-1.5"><span className="inline-block w-3 h-3 bg-emerald-500 rounded" /> <span className="text-xs">Available (142)</span></div>
              <div className="flex items-center gap-x-1.5"><span className="inline-block w-3 h-3 bg-yellow-400 rounded" /> <span className="text-xs">Reserved (31)</span></div>
              <div className="flex items-center gap-x-1.5"><span className="inline-block w-3 h-3 bg-red-500 rounded" /> <span className="text-xs">Sold (87)</span></div>
            </div>
            <div className="text-xs text-slate-400">Last updated: Just now • Click any plot to view details</div>
          </div>
          <div ref={mapRef} className="map-container w-full bg-slate-100" style={{ height: '420px' }} />
          {selectedPlot && (
            <div className="mt-4 p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-lg text-slate-800">Plot {selectedPlot.id}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{selectedPlot.size} sq.ft • {selectedPlot.facing} facing • ₹{selectedPlot.price} Lakh</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold px-3 py-1 rounded-full ${selectedPlot.status === 'available' ? 'bg-emerald-100 text-emerald-700' : selectedPlot.status === 'reserved' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedPlot.status.charAt(0).toUpperCase() + selectedPlot.status.slice(1)}
                  </div>
                  {selectedPlot.status === 'available' && (
                    <button onClick={handleInstantBooking} className="mt-2 px-5 py-1.5 text-xs bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/20">
                      BOOK THIS PLOT INSTANTLY
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
