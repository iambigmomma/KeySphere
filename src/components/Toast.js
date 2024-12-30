import { forwardRef } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

const Toast = forwardRef(function Toast({ message, type = 'success' }, ref) {
  const styles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />,
    error: <ExclamationCircleIcon className="w-5 h-5 mr-2 text-red-500" />,
    warning: <ExclamationCircleIcon className="w-5 h-5 mr-2 text-yellow-500" />,
    info: <EyeIcon className="w-5 h-5 mr-2 text-blue-500" />
  };

  return (
    <div
      ref={ref}
      className={`fixed top-4 left-1/2 -translate-x-1/2
        flex items-center px-4 py-3 rounded-lg shadow-lg 
        animate-toast z-50 ${styles[type]}`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
    </div>
  );
});

export default Toast; 