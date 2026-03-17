import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { clearCart } from "../services/cartService";

const Checkout = () => {
  const navigate = useNavigate();
  const { setCartCount } = useApp();
  const { state } = useLocation();

  const [giftCode, setGiftCode] = useState("");
  const [giftUsed, setGiftUsed] = useState(0);

  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const isGiftCard = state.type === "gift";
  const isCart = state.type === "cart";

  const total = isGiftCard ? state.amount : state.total;
  const items = isCart ? state.items : [];
  const finalTotal = Math.max(total - giftUsed, 0);

  const applyGiftCard = async () => {
    const res = await fetch("http://localhost:3000/api/giftcards/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: giftCode }),
    });

    const data = await res.json();

    if (data.valid) {
      setGiftUsed(Math.min(data.balance, total));
    } else {
      alert("Invalid gift card");
    }
  };

  const handlePayment = async () => {
    try {
      if (isGiftCard) {
        const res = await fetch("http://localhost:3000/api/giftcards", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: state.amount,
            email: state.email,
            message: state.message,
          }),
        });

        if (!res.ok) throw new Error("Gift card creation failed");

        const data = await res.json();

        navigate("/gift-card/success", {
          replace: true,
          state: {
            amount: state.amount,
            email: state.email,
            message: state.message,
            code: data.code,
          },
        });

        return;
      }

      await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({
            product: it.product._id,
            name: it.product.name,
            price: it.product.price,
            quantity: it.quantity,
            img: it.product.img,
          })),
          totalAmount: finalTotal,
          giftCode: giftUsed > 0 ? giftCode : null,
          giftUsed,
        }),
      });

      await clearCart();
      setCartCount(0);
      navigate("/order-success");
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      alert("Payment failed. Check console.");
    }
  };

  return (
    <section className="min-h-screen bg-[#fbf9f6] flex items-center justify-center px-6 pt-32">
      <div className="w-full max-w-md bg-white rounded-3xl px-10 py-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-gray-500">
            Secure Checkout
          </p>
          <h1 className="text-3xl font-semibold text-[#1a1816] mt-3">
            Review & Pay
          </h1>
        </div>

        {/* CART SUMMARY */}
        {isCart && (
          <>
            <div className="space-y-3 mb-8">
              {items.map((it) => (
                <div
                  key={it.product._id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {it.product.name} × {it.quantity}
                  </span>
                  <span className="font-medium text-[#1a1816]">
                    ₹{it.product.price * it.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* GIFT CARD */}
            <div className="bg-[#f7f3ed] rounded-2xl p-6 mb-8">
              <p className="text-sm font-medium text-[#1a1816] mb-3">
                Have a gift card?
              </p>

              <input
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                placeholder="Enter gift card code"
                className="
                  w-full
                  bg-white
                  border border-gray-300
                  rounded-full
                  px-5 py-3
                  text-sm
                  outline-none
                  focus:border-black
                  mb-4
                "
              />

              <button
                onClick={applyGiftCard}
                className="
                  w-full
                  border border-black
                  rounded-full
                  py-3
                  text-sm
                  tracking-wide
                  hover:bg-black hover:text-white
                  transition
                "
              >
                Apply Gift Card
              </button>

              {giftUsed > 0 && (
                <p className="text-green-700 text-sm mt-3">
                  Gift applied: −₹{giftUsed}
                </p>
              )}
            </div>
          </>
        )}

        {/* PAY BUTTON */}
        <button
          onClick={handlePayment}
          className="
            w-full
            bg-[#1a1816]
            text-white
            py-4
            rounded-full
            tracking-wide
            text-sm
            hover:bg-black
            transition
          "
        >
          Pay ₹{finalTotal}
        </button>
      </div>
    </section>
  );
};

export default Checkout;
