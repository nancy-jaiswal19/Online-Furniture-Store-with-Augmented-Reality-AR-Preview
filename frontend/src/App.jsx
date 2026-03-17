import { useEffect } from "react";
import AppRoutes from "./router/AppRoutes";
import ScrollToTop from "./common/ScrollToTop";
import { useApp } from "/src/context/AppContext";
import { Toaster } from "react-hot-toast";



export default function App() {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <Toaster
  position="bottom-right"
  toastOptions={{
    duration: 5000,
  }}
/>

    </>
  );
}

