import { FaExclamationTriangle } from 'react-icons/fa';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle className="text-red-500 text-xl" />
        </div>
        <p className="text-red-700 font-medium mb-1">Something went wrong</p>
        <p className="text-red-500 text-sm mb-4">{message || 'An unexpected error occurred. Please try again.'}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
