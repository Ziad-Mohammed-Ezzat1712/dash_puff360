import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  BarChart,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const links = [
    { name: "Overview", path: "", icon: LayoutDashboard },
    { name: "Products", path: "products", icon: Package },
    { name: "AddProduct", path: "addproduct", icon: Package },
    { name: "AddColor", path: "addcolor", icon: Users },
    { name: "AddCategories", path: "addcategories", icon: Users },
    { name: "AddBrand", path: "addbrand", icon: Users },
    { name: "Discounts_Dashboard", path: "discountsdashboard", icon: Tag },
    { name: "Orders", path: "orders", icon: ShoppingBag },
    { name: "Customers", path: "customers", icon: Users },
    { name: "Coupons", path: "coupons", icon: Tag },
    { name: "Analytics", path: "analytics", icon: BarChart },
  ];

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
      </aside>
    </>
  );
}
