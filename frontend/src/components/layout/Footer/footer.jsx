import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
    const [emails, setEmails] = useState([]);
    const [email, setEmail] = useState("");


   useEffect(() => {
    axios
      .get("http://localhost:3000/api/newsletter/all", {
        withCredentials: true,
      })
      .then((res) => setEmails(res.data))
      .catch(console.error);
  }, []);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await axios.post("http://localhost:3000/api/newsletter/subscribe", {
        email,
      });

      setMessage("🎉 You’re subscribed!");
      setEmail("");
    } catch (err) {
  console.log("NEWSLETTER ERROR:", err.response?.data || err.message);

  if (err.response?.status === 409) {
    setMessage("You’re already subscribed");
  } else if (err.response?.status === 400) {
    setMessage("Invalid email");
  } else {
    setMessage("Something went wrong. Try again.");
  }
}
 finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-[#f7f5f1] text-black pt-36 pb-12 mt-32">

      {/* GLASS NEWSLETTER CARD */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-10 border border-white/60 animate-fadeUp">
        <h3 className="text-2xl font-semibold text-center tracking-wide">
          Join Our Home Inspiration Club
        </h3>

        <p className="text-center text-gray-600 mt-2">
          Weekly curated picks, modern interior trends, and exclusive discounts.
        </p>

        {/* INPUT */}
        <div className="flex mt-6 gap-3 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-3 w-72 border border-gray-300 rounded-xl outline-none focus:border-black"
          />

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">
            {message}
          </p>
        )}
      </div>

      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-18 mt-10">
        {/* BRAND */}
        <div>
          <h1 className="text-4xl font-bold tracking-wide">HOMESPACE</h1>
          <p className="text-gray-700 mt-3 leading-relaxed">
            Crafted for comfort. Designed for elegance.
            Your luxury home journey starts here.
          </p>

          <div className="flex gap-5 mt-6">
            {[FaInstagram, FaFacebookF, FaPinterestP, FaTwitter].map((Icon, i) => (
              <div
                key={i}
                className="p-3 bg-white shadow rounded-full text-xl cursor-pointer hover:scale-110 transition"
              >
                <Icon />
              </div>
            ))}
          </div>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-lg font-semibold mb-4 tracking-wide">Shop</h3>
          <ul className="space-y-3 text-gray-700">
            <li><Link to="/shop/living-room">Living Room</Link></li>
            <li><Link to="/shop/bedroom">Bedroom</Link></li>
            <li><Link to="/collections/sofas">Sofas</Link></li>
            <li><Link to="/collections/lamps">Lighting</Link></li>
            <li><Link to="/collections/tables">Tables</Link></li>
            <li><Link to="/collections/office">Office</Link></li>
          </ul>
        </div>

        {/* CUSTOMER SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold mb-4 tracking-wide">Customer Support</h3>
          <ul className="space-y-3 text-gray-700">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/refund">Refund Policy</Link></li>
            <li><Link to="/track">Order Tracking</Link></li>
            <li><Link to="/support">Help Center</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-4 tracking-wide">Contact</h3>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-3">
              <FiMapPin /> New Delhi, India
            </li>
            <li className="flex items-center gap-3">
              <FiPhone /> +91 98765 43210
            </li>
           <li className="flex items-center gap-3">
  <FiMail />
  <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=arhomespace@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    arhomespace@gmail.com
  </a>
</li>

          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-20 border-t border-gray-300 pt-6">
        <div className="max-w-7xl mx-auto px-10 flex flex-col sm:flex-row justify-between text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} HOMESPACE — Crafted for Modern Living.</p>

          <div className="flex gap-6">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
