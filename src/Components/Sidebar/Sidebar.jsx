import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PackagePlus,
  Users,
  Palette,
  BadgeDollarSign,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import DevicesDropdown from "../DevicesDropdown/DevicesDropdown";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
    {
      name: "Discounts_Dashboard",
      path: "discountsdashboard",
      icon: BadgeDollarSign,
    },
    { name: "Admins", path: "admins", icon: Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {/* 🔘 Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#530606] text-white p-2 rounded-lg shadow-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🌑 Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 📌 Sidebar */}
      <aside
        className={`bg-[#530606] text-white w-64 p-4 transition-transform duration-300
        fixed top-0 left-0 h-auto z-50
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative`}
      >
        <h2 className="text-2xl font-bold mb-8 text-center">
          Vape Admin
        </h2>

        <nav className="flex flex-col gap-2 ">

          {/* 🔽 Add Products */}
          <div className="">
            <button
              onClick={() => setProductOpen(!productOpen)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-[#880a0a] ${
                location.pathname.includes("addproduct") ? "bg-[#830808]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <PackagePlus size={20} />
                <span className=" font-medium">AddProducts</span>
              </div>
              {productOpen ? <ChevronDown /> : <ChevronRight />}
            </button>

            {productOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-2 text-white">

                {[
                  { name: "Add Liquid", path: "addproduct/liquid" },
                  { name: "Add Salt", path: "addproduct/salt" },
                  { name: "Add Disposable", path: "addproduct/disposable" },
                  { name: "Add Devices", path: "addproduct/device" },
                  { name: "Add Accessories", path: "addproduct/accessories" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-2 rounded-md text-white hover:bg-[#830808] ${
                      location.pathname.includes(item.path.split("/")[1])
                        ? "bg-[#830808]"
                        : ""
                    }`}
                  >
                    <span className="text-white font-medium">{item.name}</span>
                  </Link>
                ))}

              </div>
            )}
          </div>

          {/* 🔽 Show Products */}
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
              {showproductOpen ? <ChevronDown /> : <ChevronRight />}
            </button>

            {showproductOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-2">

                {[
                  { name: "Liquid's Products", path: "showProducts/liquids" },
                  { name: "Salt's Products", path: "showProducts/salts" },
                  { name: "Disposable's Products", path: "showProducts/disposables" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-2 rounded-md hover:bg-[#830808] ${
                      location.pathname.includes(item.path.split("/")[1])
                        ? "bg-[#830808]"
                        : ""
                    }`}
                  >
                    <span className="text-white font-medium">{item.name}</span>
                  </Link>
                ))}

                <DevicesDropdown />

                <Link
                  to="showProducts/accessoriess"
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-md  hover:bg-[#830808] ${
                    location.pathname.includes("accessoriess")
                      ? "bg-[#830808]"
                      : ""
                  }`}
                >
                <span className="text-white font-medium">Accessories's Products</span>  
                </Link>

              </div>
            )}
          </div>

          {/* 🔗 باقي اللينكات */}
          {links.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`flex  items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#880a0a]  ${
                location.pathname.includes(path) && path !== ""
                  ? "bg-[#830808]"
                  : ""
              }`}
            >
              <Icon size={20} className="text-white" />
              <span className="text-white font-medium">{name}</span>
            </Link>
          ))}
        </nav>

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2 mt-6 bg-red-600 rounded-2xl hover:bg-red-800"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>
    </>
  );
}