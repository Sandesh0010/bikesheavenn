import React from "react";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case "warning":
        return "text-yellow-500";
      case "danger":
        return "text-red-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return (
          <svg
            className={`w-6 h-6 ${getIconColor()}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.46 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        );
      case "danger":
        return (
          <svg
            className={`w-6 h-6 ${getIconColor()}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        );
      case "info":
        return (
          <svg
            className={`w-6 h-6 ${getIconColor()}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-[9999] animate-fade-in p-4">
      <div className="bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] max-w-sm w-full animate-scale-in border border-white/20">
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`mb-4 p-3 rounded-2xl ${
            type === "danger" || type === "warning" ? "bg-red-50" : "bg-blue-50"
          }`}>
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">{message}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-full !font-bold !text-gray-500 hover:!text-gray-700 hover:!bg-gray-100 transition-all duration-300 !bg-transparent !border-none !shadow-none cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer ${
                type === "danger" || type === "warning"
                  ? "!bg-red-500 hover:!bg-red-600 !text-white"
                  : "!bg-blue-500 hover:!bg-blue-600 !text-white"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
