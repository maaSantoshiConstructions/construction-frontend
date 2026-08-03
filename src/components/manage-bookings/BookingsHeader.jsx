import { FaPlus } from 'react-icons/fa';

export default function BookingsHeader({ openFormModal }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Booking Management</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage all plot bookings and payment progress</p>
      </div>
      <button
        onClick={() => openFormModal()}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 transition-all"
      >
        <FaPlus />
        New Booking
      </button>
    </div>
  );
}
