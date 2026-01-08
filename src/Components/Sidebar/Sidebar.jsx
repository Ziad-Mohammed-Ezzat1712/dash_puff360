import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Users,
  Tag,
  Palette ,
  BarChart,
  BadgeDollarSign ,
  Menu,
  X,
} from "lucide-react";
import { LogOut } from "lucide-react";
export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const links = [
    { name: "Overview", path: "", icon: LayoutDashboard },
    { name: "Products", path: "products", icon: Package },
    { name: "AddProduct", path: "addproduct", icon: PackagePlus },
    { name: "AddColor", path: "addcolor", icon: Palette },
    { name: "AddCategories", path: "addcategories", icon: PackagePlus },
    { name: "AddBrand", path: "addbrand", icon: PackagePlus },
    { name: "Discounts_Dashboard", path: "discountsdashboard", icon: BadgeDollarSign },
    { name: "Admins", path: "admins", icon: Users },

  ];
const handleLogout = () => {
  localStorage.removeItem("token"); 
  window.location.href = "/";  // روح على صفحة اللوجن
};
  return (
    <>
      {/* Toggle Sidebar for mobile */}
      <button
        className="md:hidden p-4"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`bg-[#530606] text-white  w-64 p-4 transition-transform duration-300 ${
          open ? "translate-x-0 "  : "-translate-x-full "
        } md:translate-x-0 fixed md:relative  h-auto z-50`}
      >
        <h2 className="text-2xl font-bold mb-8 text-center text-white">
          Vape Admin
        </h2>
        <nav className="flex flex-col text-white gap-2">
          {links.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex text-white items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#880a0a]  ${
                location.pathname === path ? "hover:bg-[#830808]" : ""
              }`}
            >
              <Icon size={20} className="text-white" />
              <span className="text-white font-medium">{name}</span>
            </Link>
          ))}
             

        </nav>
      <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-15 py-2 ml-2  my-2 bg-red-600 text-white rounded-2xl hover:bg-red-900 cursor-pointer"
    >
      <LogOut size={20} />
      Sign Out
    </button>
      </aside>

      
    </>
  );
}
