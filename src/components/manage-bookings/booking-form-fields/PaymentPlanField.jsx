import { FaLock } from 'react-icons/fa';
import { PLAN_LABELS } from '../../../constants/statusStyles';

export default function PaymentPlanField({ isEdit, editing, isSuperAdmin, register, onOpenPlanDialog }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        Payment Plan
      </label>
      {isEdit ? (
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium">
            <FaLock className="text-slate-400 text-xs" />
            <span>{PLAN_LABELS[editing?.paymentPlan] || editing?.paymentPlan || '—'}</span>
          </div>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={onOpenPlanDialog}
              className="px-3 py-3 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors whitespace-nowrap"
              title="Super Admin override"
            >
              Change Plan ↗
            </button>
          )}
        </div>
      ) : (
        <select
          {...register('paymentPlan')}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
        >
          <option value="full_payment">Full Payment</option>
          <option value="installment">Installment Plan</option>
          <option value="loan">Bank Loan</option>
        </select>
      )}
      {isEdit && (
        <p className="text-xs text-slate-400 mt-1.5">
          Payment plan cannot be changed after booking is created.{isSuperAdmin ? '' : ' Contact Super Admin for exceptions.'}
        </p>
      )}
    </div>
  );
}
