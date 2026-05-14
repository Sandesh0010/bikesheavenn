import React, { useEffect } from "react";

export default function MarketplaceNotification({
  message,
  type = "success", // 'success' or 'delete'
  isVisible,
  onClose,
  duration = 1200,
}) {
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const isDelete = type === "delete";

  const outerGradient = isDelete
    ? "bg-gradient-to-r from-red-400 to-red-500"
    : "bg-gradient-to-r from-green-400 to-teal-400";

  return (
    <div className="fixed inset-0 flex items-start justify-center pointer-events-none z-[9998]">
      <div className="mt-20 pointer-events-auto">
        <div
          className={`relative rounded-2xl px-4 py-3 shadow-2xl animate-scale-in animate-fade-in ${outerGradient}`}
        >
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent blur-md opacity-30" />

          <div className="relative flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${isDelete ? "bg-red-500" : "bg-white/20"} ring-2 ${isDelete ? "ring-red-200" : "ring-white/40"} animate-pulse`}
            >
              {isDelete ? (
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>

            <div className="text-left">
              <div className="font-extrabold text-base text-white">
                {message}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
