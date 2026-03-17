import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const HOTSPOT_POSITIONS = {
  "living-room": {
    sofas: { x: 42, y: 68 },
    tables: { x: 50, y: 78 },
    chairs: { x: 20, y: 75 },
    decor: { x: 25, y: 60 },
    lamps: { x: 84, y: 42 },
  },
  "dining-room": {
    tables: { x: 50, y: 72 },
    chairs: { x: 35, y: 75 },
    decor: { x: 88, y: 38 },
    lamps: { x: 50, y: 28 },
  },
  "bedroom": {
    beds: { x: 50, y: 75 },
    wardrobes: { x: 78, y: 62 },
    lamps: { x: 30, y: 55 },
    decor: { x: 45, y: 40 },
  },
  "office" : {
    chairs: {x: 60, y: 55},
    tables: {x: 50, y: 50},
    lamps: {x: 50, y: 50},
  },
  "kids-room" : {
    decor : {x: 50, y: 50},
    chairs: {x:50, y:50},
    lamps: {x: 50, y:50},
    wardrobes: {x:50, y: 50},
    beds: {x: 50, y: 50},
    tables: {x: 50, y: 50},
  },
};

const RoomHotspotSection = ({ roomImg, products, roomSlug }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  const hotspots = useMemo(() => {
    const result = [];
    const roomConfig = HOTSPOT_POSITIONS[roomSlug] || {};

    Object.entries(roomConfig).forEach(([category, pos]) => {
      const product = products.find(
        (p) =>
          p.room === roomSlug &&
          p.category?.toLowerCase() === category
      );

      if (!product) return;

      result.push({
        ...product,
        x: pos.x,
        y: pos.y,
      });
    });

    return result;
  }, [products, roomSlug]);

  return (
    <div className="relative w-full mt-8 overflow-hidden">
      <img
        src={roomImg}
        alt="Room"
        className="w- block "
      />

      {hotspots.map((p, i) => (
        <div
          key={p._id}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          className="absolute z-20"
        >
          <button
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onClick={() => navigate(`/product/${p._id}`)}
            className="w-5 h-5 bg-white border-2 border-black rounded-full flex items-center justify-center"
          >
            <span className="w-2 h-2 bg-black rounded-full" />
          </button>

          {active === i && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-3 w-48">
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-sm text-gray-600">
                ₹{p.price.toLocaleString()}
              </p>
              <span className="text-xs underline block mt-1">
                View product →
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoomHotspotSection;
