import React from "react";
import { Link } from "react-router-dom";
import assets from "../assets/hero.png";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { logout, accessToken } = useAuth();
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
      <Link to="/list">
        <img src={assets} alt="Logo" className="h-10 w-auto cursor-pointer" />
      </Link>
      <div className="flex items-center gap-3">
        <Link
          to="/list"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Products
        </Link>
        <Link
          to="/categories"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Categories
        </Link>
        {accessToken ? (
          <button
            onClick={logout}
            className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600 active:scale-95"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/register"
              className="rounded-lg border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
