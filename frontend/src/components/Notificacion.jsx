import { useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

const Notification = ({ message, type, onClose, onConfirm, onCancel }) => {
  useEffect(() => {
    if (type !== "confirm") {
      const timer = setTimeout(() => {
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose, type]);

  if (type === "confirm") {
    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm border border-gray-600">
          <div className="flex items-start gap-2 mb-3">
            <ExclamationCircleIcon className="w-6 h-6 text-yellow-400 mt-0.5" />
            <p className="font-medium">{message}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                onConfirm?.();
                onClose?.();
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              Sí
            </button>
            <button
              onClick={() => {
                onCancel?.();
                onClose?.();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center p-4 rounded-lg shadow-lg border ${
          type === "success"
            ? "bg-gray-700 border-green-500 text-green-400"
            : "bg-gray-700 border-red-500 text-red-400"
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