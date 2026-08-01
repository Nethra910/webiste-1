import React from "react";
import assets from "../assets/hero.png";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { logout } = useAuth();
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
      <img src={assets} alt="Logo" className="h-10 w-auto cursor-pointer" />
      <button
        onClick={logout}
        className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600 active:scale-95"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
