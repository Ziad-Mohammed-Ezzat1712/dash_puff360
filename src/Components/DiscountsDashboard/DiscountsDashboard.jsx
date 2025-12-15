import React, { useState } from "react";
import AddDiscount from "../AddDiscount/AddDiscount";
import DiscountsList from "../DiscountsList/DiscountsList";
import EditDiscount from "../EditDiscount/EditDiscount";


export default function DiscountsDashboard() {
  const [editItem, setEditItem] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="space-y-8">
      <AddDiscount />

      <DiscountsList
        key={refresh}
        onEdit={(item) => setEditItem(item)}
      />

      {editItem && (
        <EditDiscount
          discount={editItem}
          onClose={() => setEditItem(null)}
          onUpdated={() => setRefresh(!refresh)}
        />
      )}
    </div>
  );
}
