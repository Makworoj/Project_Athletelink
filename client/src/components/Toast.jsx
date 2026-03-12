import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 ${bgColor}`}>
      {type === 'success' ? '✓' : '✕'} {message}
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">×</button>
    </div>
  );
}