import { FaFolderOpen } from 'react-icons/fa';

export default function EmptyState({ icon: Icon = FaFolderOpen, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-slate-400 text-3xl" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title || 'No data found'}</h3>
      <p className="text-sm text-slate-500 text-center max-w-xs mb-4">
        {description || 'There is nothing to display here yet.'}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-full transition-colors"
        >
          {action.label || 'Get Started'}
        </button>
      )}
    </div>
  );
}
