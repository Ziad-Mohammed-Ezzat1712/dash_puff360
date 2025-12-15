import React from "react";

export default function Header() {
    const userName = localStorage.getItem("adminName"); // لو بتحفظ الاسم
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 font-semibold text-xl ">Welcome,{userName}</span>
      
      </div>
    </header>
  );
}
