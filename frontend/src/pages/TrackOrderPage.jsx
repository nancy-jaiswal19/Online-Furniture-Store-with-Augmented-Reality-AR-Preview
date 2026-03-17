import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const STEPS = ["Confirmed", "Packed", "Shipped", "Delivered"];

export default function TrackOrderPage() {
  const location = useLocation();
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("orderId");
    if (id) setTrackingId(id);
  }, [location.search]);

  const handleTrack = async () => {
    try {
      setError("");
      const res = await axios.get(
        "http://localhost:3000/api/orders/track",
        { params: { orderId: trackingId } }
      );
      setOrder(res.data);
    } catch {
      setOrder(null);
      setError("No order found with this Tracking ID.");
    }
  };

  return (
    <section className="pt-32 max-w-xl mx-auto px-6 py-35 my-30">
      <h1 className="text-2xl mb-6">Track Your Order</h1>

      <div className="flex gap-3">
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-full"
        />
        <button
          onClick={handleTrack}
          className="px-6 py-2 bg-[#3f3a33] text-white rounded-full"
        >
          Track
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {order && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <p className="font-medium mb-3">Order #{order.orderId}</p>

          {STEPS.map((s) => (
            <div key={s} className="flex items-center gap-3 mb-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  STEPS.indexOf(order.status) >= STEPS.indexOf(s)
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
