import React from "react";
export default function Modal({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center z-50 bg-black/20 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg border border-black relative flex flex-col w-full max-w-md max-h-[90vh] overflow-y-auto overflow-hidden animate-scale-in"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 !text-black hover:!text-red-600 !font-extrabold text-xl !bg-transparent hover:!bg-transparent rounded-full w-9 h-9 flex items-center justify-center transition-colors duration-200 cursor-pointer z-10 !border-transparent !shadow-none"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
