import { useState } from 'react';
import { FaCheckDouble } from 'react-icons/fa';

export default function SiteVisitModal({ onClose }) {
  const [date] = useState('2026-07-12');
  const [time, setTime] = useState('11:30 AM - 12:30 PM');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBooking = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
    }, 450);
  };

  if (confirmed) {
    return (
      <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        className="fixed inset-0 bg-black/70 z-[130] flex items-center justify-center p-4">
        <div onClick={(e) => e.stopPropagation()} className="bg-white max-w-md w-full rounded-3xl p-8 text-center shadow-2xl"
          style={{ animation: 'modalPopIn 0.3s ease forwards' }}>
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckDouble className="text-emerald-500 text-3xl" />
          </div>
          <div className="font-bold text-2xl text-slate-800">Site Visit Confirmed!</div>
          <div className="mt-2 text-slate-600">
            Your visit is scheduled for <strong>{date}</strong> at <strong>{time}</strong>
          </div>
          <div className="my-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-left">
            <div className="font-semibold">WhatsApp Confirmation Sent</div>
            <div className="text-emerald-700">+91 98765 43210</div>
            <div className="mt-3 text-xs">Google Maps link and assigned executive details shared.</div>
          </div>
          <button onClick={onClose}
            className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl text-sm font-semibold transition">
            DONE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'modalPopIn 0.3s ease forwards' }}>
        <div className="px-7 py-5 border-b">
          <span className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-2xl">FEATURE 07</span>
          <div className="font-bold text-xl mt-1 text-slate-800">Smart Site Visit Booking</div>
        </div>
        <div className="p-7 space-y-4 text-sm">
          <div>
            <label className="text-xs font-medium text-slate-600">Preferred Date</label>
            <input type="date" defaultValue={date} className="w-full border px-4 py-2.5 rounded-2xl mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Time Slot</label>
              <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full border px-4 py-2.5 rounded-2xl mt-1">
                <option>10:00 AM - 11:00 AM</option>
                <option>11:30 AM - 12:30 PM</option>
                <option>02:00 PM - 03:00 PM</option>
                <option>04:00 PM - 05:00 PM</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Pickup Location</label>
              <select className="w-full border px-4 py-2.5 rounded-2xl mt-1">
                <option>Patia Square</option>
                <option>Jaydev Vihar</option>
                <option>Khandagiri Square</option>
                <option>Airport</option>
                <option>No pickup needed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Preferred Sales Executive (Optional)</label>
            <select className="w-full border px-4 py-2.5 rounded-2xl mt-1">
              <option value="">Any Available Executive</option>
              <option>Mr. Rajesh Patra (Senior)</option>
              <option>Ms. Ananya Mishra</option>
              <option>Mr. Sushant Das</option>
            </select>
          </div>
          <button onClick={handleBooking} disabled={loading}
            className="mt-3 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-3xl flex justify-center items-center gap-x-2 transition">
            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> PROCESSING...</> : <><FaCheckDouble /> CONFIRM BOOKING</>}
          </button>
          <div className="text-center text-[10px] text-emerald-600">Instant WhatsApp confirmation + Google Maps link will be sent</div>
        </div>
      </div>
    </div>
  );
}
