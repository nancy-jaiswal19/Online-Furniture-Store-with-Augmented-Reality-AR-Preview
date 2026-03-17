import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => {
  fetch("https://capiteaux-archie-zincographic.ngrok-free.dev/api/orders/admin", {
    credentials: "include",
  })
    .then((r) => r.json())
    .then((data) => {
      setOrders(data.orders || []); 
    })
    .catch(console.error);
};


  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:3000/api/orders/admin/${id}/status`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="pt-32 max-w-6xl mx-auto px-6">
      <h1 className="text-3xl mb-6">Admin Orders</h1>

      {orders.map((o) => (
        <div key={o._id} className="bg-white p-6 mb-4 rounded-xl shadow">
          <p className="mb-2">
            #{o.orderId} — {o.user?.email}
          </p>

          <select
            value={o.status}
            onChange={(e) => updateStatus(o._id, e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}
