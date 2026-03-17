import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const GiftCardSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [copied, setCopied] = React.useState(false);


  // fallback (if someone refreshes page)
  const amount = state?.amount || 0;
  const email = state?.email || "recipient email";
  const message = state?.message || "";
  const code = state?.code || "GC-XXXXXX";

  return (
    <section className="bg-[#fbf9f6] min-h-screen flex items-center justify-center px-6 pt-32">
      <div className="max-w-xl w-full bg-white rounded-3xl px-10 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#e9f4ee] text-[#3f3a33] p-5 rounded-full">
            <FiCheckCircle size={48} />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-[28px] font-medium text-[#3f3a33] mb-3">
          Gift Card Sent Successfully
        </h1>

        <p className="text-[#6b6258] text-[15px] leading-relaxed mb-10">
          Your payment was successful. The gift card has been sent digitally and
          will reach the recipient shortly.
        </p>

        {/* GIFT CODE */}
        <div className="bg-[#f7f3ed] rounded-2xl px-6 py-5 mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#7a7166] mb-3">
            Gift Card Code
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className="font-mono text-xl font-semibold tracking-[0.2em] text-[#3f3a33]">
              {code}
            </span>

            <button
  onClick={() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }}
  className={`
    text-xs
    px-4 py-2
    rounded-full
    transition
    ${
      copied
        ? "bg-[#3f3a33]/90 text-white"
        : "bg-[#3f3a33] text-white hover:bg-[#2f2a25]"
    }
  `}
>
  {copied ? "Copied" : "Copy"}
</button>

          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-[#f7f3ed] rounded-2xl px-6 py-6 text-left space-y-4 mb-10">
          <div className="flex justify-between text-sm">
            <span className="text-[#7a7166]">Gift Amount</span>
            <span className="text-[#3f3a33] font-medium">
              ₹{amount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-[#7a7166]">Sent To</span>
            <span className="text-[#3f3a33] font-medium">
              {email}
            </span>
          </div>


          {message && (
            <div className="pt-2 text-sm">
              <p className="text-[#7a7166] mb-1">Your Message</p>
              <p className="italic text-[#3f3a33] leading-relaxed">
                “{message}”
              </p>
            </div>
          )}
        </div>

        {/* INFO */}
        <p className="text-[13px] text-[#7a7166] mb-12">
          The recipient can redeem this gift card online at checkout.
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/collections"
            className="
              bg-[#3f3a33]
              text-white
              px-9 py-3.5
              rounded-full
              text-sm font-medium
              hover:bg-[#2f2a25]
              transition
            "
          >
            Continue Shopping
          </Link>

          <button
            onClick={() => navigate("/")}
            className="
              px-9 py-3.5
              rounded-full
              text-sm font-medium
              border border-[#d8d2c7]
              text-[#3f3a33]
              hover:bg-[#f4eee6]
              transition
            "
          >
            Go to Home
          </button>
        </div>

      </div>
    </section>
  );
};

export default GiftCardSuccess;
