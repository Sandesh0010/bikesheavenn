import React, { useEffect } from "react";

export default function AuthAnimation({
  message,
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

  const isLogout = /logout|logged out|signed out/i.test(message);

  const outerGradient = isLogout
    ? "bg-gradient-to-r from-blue-400 to-blue-300"
    : "bg-gradient-to-r from-green-400 to-teal-400";

  const iconColorClass = isLogout ? "text-white" : "text-white";

  return (
    <div className="fixed inset-0 flex items-start justify-center pointer-events-none z-[9998] pt-16">
      <div className="mt-0 pointer-events-auto">
        <div
          className={`relative rounded-2xl px-4 py-3 shadow-2xl animate-scale-in animate-fade-in ${outerGradient}`}
        >
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent blur-md opacity-30" />

          <div className="relative flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${isLogout ? "bg-blue-500" : "bg-white/20"} ring-2 ${isLogout ? "ring-blue-200" : "ring-white/40"} animate-pulse`}
            >
              {isLogout ? (
                <svg
                  className={`w-6 h-6 ${iconColorClass}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 12H5m8-8l-8 8 8 8"
                  />
                </svg>
              ) : (
                <svg
                  className={`w-6 h-6 ${iconColorClass}`}
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
              <div
                className={`font-extrabold text-base ${isLogout ? "text-white" : "text-white"}`}
              >
                {message}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
