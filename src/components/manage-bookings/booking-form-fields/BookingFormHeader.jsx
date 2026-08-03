import { FaTimes } from 'react-icons/fa';

export default function BookingFormHeader({ isEdit, onClose }) {
  return (
    <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {isEdit ? 'Edit Booking' : 'New Plot Booking'}
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          {isEdit ? 'Update booking details below' : 'Fill in the details to create a booking'}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
      >
        <FaTimes />
      </button>
    </div>
  );
}
