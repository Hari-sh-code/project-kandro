import React from "react";

export default function Popup({ trigger, children, onClose }) {
  if (!trigger) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-7 rounded-sm shadow-lg relative ">
        <button
          onClick={onClose}
          className="absolute top-0 right-1 text-gray-500 hover:text-gray-700 text-4xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
