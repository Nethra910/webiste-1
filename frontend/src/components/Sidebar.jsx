import React from "react";
import { NavLink } from "react-router-dom";
import assets from "../assets/hero.png";
const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen border-r border-gray-200 bg-white p-5">
      <p className="mb-6 text-xl font-bold text-gray-800">📦 Products</p>

      <div className="flex flex-col gap-3">
        <NavLink
          to="/list"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <img src={assets} alt="" className="h-5 w-5" />
          <p className="font-medium">All Products</p>
        </NavLink>

        <NavLink
          to="/add"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <img src={assets} alt="" className="h-5 w-5" />
          <p className="font-medium">Add Product</p>
        </NavLink>

        <NavLink
          to="/categories"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <img src={assets} alt="" className="h-5 w-5" />
          <p className="font-medium">Categories</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
