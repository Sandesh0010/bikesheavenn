import React from "react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full z-50 bg-gray-900 text-white py-3">
      <div className="container mx-auto text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} BikesHeaven. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
