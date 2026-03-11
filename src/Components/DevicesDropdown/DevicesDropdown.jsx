import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DevicesDropdown() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);

    if (value) {
      // نوجه المستخدم حسب الخيار المختار
      navigate(`showProducts/devices/${value}`);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <select
        value={selected}
        onChange={handleChange}
        className="px-3 py-2 rounded-md border border-transparent bg-transparent text-md font-medium text-white "
      >
        <option className="bg-transparent text-black" value="">Device's Products</option>
        <option className="bg-transparent text-black" value="alldevice">All Devices</option>
        <option className="bg-transparent text-black" value="full_kit">Full Kit</option>
        <option className="bg-transparent text-black" value="mod">Mod</option>
        <option className="bg-transparent text-black" value="pod">Pod</option>
        <option className="bg-transparent text-black" value="tank">Tank</option>
        <option className="bg-transparent text-black" value="coils_cartridges">Coils & Cartridges</option>
      </select>
    </div>
  );
}