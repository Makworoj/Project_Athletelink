import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  // useEffect manages the lifecycle of the notification
  useEffect(() => {
    // Automatically triggers the onClose function after 4 seconds (4000ms)
    const timer = setTimeout(() => onClose(), 4000);

    // Cleanup function: clears the timer if the component is unmounted 
    // (e.g., if the user manually closes it or navigates away) to prevent memory leaks
    return () => clearTimeout(timer);
  }, [onClose]); // Re-runs only if the onClose function reference changes

  // Dynamically sets the background color based on the 'type' prop
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    // Uses fixed positioning to float the toast in the bottom-right corner of the screen
    <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 animate-bounce-in ${bgColor}`}>
      
      {/* Renders a simple icon based on whether the message is a success or an error */}
      {type === 'success' ? '✓' : '✕'} 
      
      {/* The actual text message to be displayed */}
      {message}

      {/* Manual close button to allow the user to dismiss the notification early */}
      <button 
        onClick={onClose} 
        className="ml-4 text-white/80 hover:text-white text-xl leading-none"
      >
        ×
      </button>
    </div>
  );
}