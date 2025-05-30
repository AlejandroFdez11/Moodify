import { useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center p-4 rounded-lg shadow-lg ${
          type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {type === "success" ? (
          <CheckCircleIcon className="w-6 h-6 mr-2" />
        ) : (
          <XCircleIcon className="w-6 h-6 mr-2" />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Notification;