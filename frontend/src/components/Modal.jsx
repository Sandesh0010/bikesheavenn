import React from "react";
export default function Modal({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center z-50 bg-black/20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg border border-black relative flex flex-col w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="self-end text-black font-bold text-lg hover:text-gray-600 m-2"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
