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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[130] flex items-center justify-center p-4">
        <div onClick={(e) => e.stopPropagation()}
          className="modal bg-gradient-to-br from-white to-emerald-50 max-w-md w-full rounded-2xl p-8 text-center shadow-2xl border border-white/10">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
            <FaCheckDouble className="text-white text-3xl" />
          </div>
          <div className="font-bold text-2xl text-slate-800">Site Visit Confirmed!</div>
          <div className="mt-2 text-slate-500">
            Your visit is scheduled for <strong className="text-slate-700">{date}</strong> at <strong className="text-slate-700">{time}</strong>
          </div>
          <div className="mt-3 text-sm text-slate-400">A confirmation has been sent via WhatsApp. Our executive will call you 1 hour before the visit.</div>
          <button onClick={onClose}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/20">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()}
        className="modal bg-white w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg">FEATURE 07</span>
          <div className="font-bold text-xl mt-2 text-slate-800">Smart Site Visit Booking</div>
        </div>
        <div className="p-7 space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-slate-500">Preferred Date</label>
            <input id="visit-date" type="date" value={date}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl mt-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Time Slot</label>
              <select id="visit-time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full border border-slate-200 px-4 py-2.5 rounded-xl mt-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all">
                <option>10:00 AM - 11:00 AM</option>
                <option>11:30 AM - 12:30 PM</option>
                <option>02:00 PM - 03:00 PM</option>
                <option>04:00 PM - 05:00 PM</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Pickup Location</label>
              <select id="visit-pickup" className="w-full border border-slate-200 px-4 py-2.5 rounded-xl mt-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all">
                <option>Patia Square</option>
                <option>Jaydev Vihar</option>
                <option>Khandagiri Square</option>
                <option>Airport</option>
                <option>No pickup needed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Preferred Sales Executive (Optional)</label>
            <select id="visit-executive" className="w-full border border-slate-200 px-4 py-2.5 rounded-xl mt-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all">
              <option value="">Any Available Executive</option>
              <option>Mr. Rajesh Patra (Senior)</option>
              <option>Ms. Ananya Mishra</option>
              <option>Mr. Sushant Das</option>
            </select>
          </div>
          <button onClick={handleBooking} disabled={loading}
            className="mt-3 w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:from-emerald-800 active:to-emerald-900 text-white font-semibold rounded-xl flex justify-center items-center gap-x-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> <span>Booking...</span></>
            ) : (
              <><FaCheckDouble /> <span>Confirm Site Visit</span></>
            )}
          </button>
          <div className="text-[10px] text-center text-slate-400">You will receive instant WhatsApp confirmation + reminder</div>
        </div>
      </div>
    </div>
  );
}
