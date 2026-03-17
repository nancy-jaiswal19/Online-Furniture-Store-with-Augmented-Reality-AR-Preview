import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  fetch("http://localhost:3000/api/orders/my", {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    })
    .then((data) => {
      // handle BOTH response shapes safely
      setOrders(Array.isArray(data) ? data : data.orders || []);
    })
    .catch((err) => {
      console.error("ORDERS ERROR:", err);
      setOrders([]);
    });
}, []);


  if (orders.length === 0) {
    return <p className="text-gray-500">No orders yet.</p>;
  }

  return (
    <div className="space-y-4 pt-25">
      {orders.map((o) => (
  <div
    key={o._id}
    className="border p-4 rounded-xl flex gap-4 cursor-pointer hover:bg-gray-50"
    onClick={() => navigate(`/orders/${o.orderId}`)}
  >
    {/* IMAGE */}
    <img
      src={
  o.items[0]?.img?.startsWith("http")
    ? o.items[0].img
    : `${import.meta.env.VITE_API_URL}${o.items[0].img}`
}

      alt={o.items[0]?.name}
      className="w-20 h-20 object-cover rounded-lg border"
    />

    {/* DETAILS */}
    <div className="flex-1">
      <p className="font-medium">Order #{o.orderId}</p>
      <p className="text-sm text-gray-500">{o.status}</p>
      <p className="text-sm text-gray-500">
        {o.items.length} items
      </p>
    </div>

    <p className="font-semibold">₹{o.total}</p>
  </div>
))}

    </div>
  );
}
