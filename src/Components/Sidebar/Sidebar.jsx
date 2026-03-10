import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Users,
  Tag,
  Palette,
  BarChart,
  BadgeDollarSign,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import DevicesDropdown from "../DevicesDropdown/DevicesDropdown";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  // dropdown يفتح تلقائي لو انت داخل صفحة addproduct
  const [productOpen, setProductOpen] = useState(
    location.pathname.includes("addproduct")
  );
  const [showproductOpen, setshowProductOpen] = useState(
    location.pathname.includes("showProducts")
  );

  const links = [
    { name: "Overview", path: "", icon: LayoutDashboard },
    { name: "AddColor", path: "addcolor", icon: Palette },
    { name: "AddCategories", path: "addcategories", icon: PackagePlus },
    { name: "AddBrand", path: "addbrand", icon: PackagePlus },
    { name: "Discounts_Dashboard", path: "discountsdashboard", icon: BadgeDollarSign },
    { name: "Admins", path: "admins", icon: Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button className="md:hidden p-4" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`bg-[#530606] text-white w-64 p-4 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative h-auto z-50`}
      >
        <h2 className="text-2xl font-bold mb-8 text-center text-white">
          Vape Admin
        </h2>

        <nav className="flex flex-col gap-2">
  

          {/* AddProduct Dropdown */}
          <div>
            <button
              onClick={() => setProductOpen(!productOpen)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-[#880a0a] ${
                location.pathname.includes("addproduct")
                  ? "bg-[#830808]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <PackagePlus size={20} />
                <span className="font-medium">AddProducts</span>
              </div>
              {productOpen ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>

            {productOpen && (
              <div className="ml-8 mt-2 flex flex-col gap-2 text-sm">

                <Link
                  to="addproduct/liquid"
                  className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                    location.pathname.includes("liquid")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                  <span className="text-white text-md font-medium">Add Liquid</span>
                </Link>

                <Link
                  to="addproduct/salt"
                  className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                    location.pathname.includes("salt")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                  <span className="text-white text-md font-medium">Add Salt</span>
                </Link>
                       <Link
                  to="addproduct/disposable"
                  className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                    location.pathname.includes("disposable")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                  <span className="text-white text-md font-medium">Add Disposable</span>
                </Link>

                <Link
                  to="addproduct/device"
                  className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                    location.pathname.includes("device")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                 <span className="text-white text-md font-medium"> Add Devices</span>
                </Link>
                <Link
                  to="addproduct/accessories"
                  className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                    location.pathname.includes("accessories")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                 <span className="text-white text-md font-medium"> Add Accessories</span>
                </Link>

              </div>
            )}
          </div>
 {/* Show Dropdown */}
          <div>
            <button
              onClick={() => setshowProductOpen(!showproductOpen)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-[#880a0a] ${
                location.pathname.includes("showProducts")
                  ? "bg-[#830808]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <PackagePlus size={20} />
                <span className="font-medium">ShowProducts</span>
              </div>
              {showproductOpen ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>

            {showproductOpen && (
              <div className="ml-8 mt-2 flex flex-col gap-2 text-sm">

                <Link
                  to="showProducts/liquids"
                  className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                    location.pathname.includes("liquids")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                  <span className="text-white text-md font-medium">Liquid's Products</span>
                </Link>
                <Link
                  to="showProducts/salts"
                  className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                    location.pathname.includes("salts")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                  <span className="text-white text-md font-medium">Salt's Products</span>
                </Link>
                <Link
                  to="showProducts/disposables"
                  className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                    location.pathname.includes("disposables")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                  <span className="text-white text-md font-medium">Disposable's Products</span>
                </Link>

               <DevicesDropdown/>

                <Link
                  to="showProducts/accessoriess"
                  className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                    location.pathname.includes("accessoriess")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                 <span className="text-white text-md font-medium"> Accessories's Products</span>
                </Link>
        

              </div>
            )}
          </div>
          {/* اللينكات القديمة شغالة زي ما هي */}
          {links.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg  hover:bg-[#880a0a] ${
                location.pathname.includes(path) && path !== ""
                  ? "bg-[#830808]"
                  : ""
              }`}
            >
              <Icon size={20} className="text-white" />
              <span className="font-medium text-white">{name}</span>
            </Link>
          ))}
 
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2 mt-6 bg-red-600 text-white rounded-2xl hover:bg-red-900 cursor-pointer"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>
    </>
  );
}