import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import ProductPage from "../pages/ProductPage";
import BlogList from "../pages/blog/BlogList";
import BlogGrid from "../pages/blog/BlogGrid";
import BlogDetails from "../pages/blog/BlogDetails";
import AdminBlogList from "../pages/admin/AdminBlogList";
import AdminCreateBlog from "../pages/admin/AdminCreateBlog";
import UserCreateBlog from "../pages/blog/UserCreateBlog";


import Search from "../pages/Search";

import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import FAQPage from "../pages/FAQPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsPage from "../pages/TermsPage";
import SupportPage from "../pages/SupportPage";
import GiftCardsPage from "../pages/GiftCardsPage";
import Checkout from "../pages/Checkout";
import GiftCardSuccess from "../pages/GiftCardSuccess";
import Refund from "../pages/RefundPolicyPage";
import Shipping from "../pages/ShippingPolicyPage";
import MyGiftCards from "../pages/MyGiftCards";

import ProfilePage from "../pages/account/AccountPage";
import OrdersPage from "../pages/OrdersPage";
import TrackOrderPage from "../pages/TrackOrderPage";
import OrderSuccess from "../pages/OrderSuccess";


import Collections from "../pages/Collections";
import CategoryPage from "../pages/CategoryPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";

import RoomOverviewPage from "../pages/RoomOverviewPage";
import RoomCategoryPage from "../pages/RoomCategoryPage";

import AdminProducts from "../pages/AdminProducts";
import ProductForm from "../components/admin/ProductForm";
import AdminMessages from "../components/admin/AdminMessages";
import AdminOrders from "../pages/admin/AdminOrders";
import OrdersTab from "../pages/OrdersTab"

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPasswordPage from "../components/auth/ForgotPasswordPage";
import OTPPage from "../components/auth/OTPPage";
import ResetPasswordPage from "../components/auth/ResetPasswordPage";
import ResetSuccessPage from "../components/auth/ResetSuccessPage";
import VerifyEmail from "../components/auth/VerifyEmail";
import VerifyPendingPage from "../components/auth/VerifyPendingPage";

const AppRoutes = () => {
  return (
    <Routes>

        <Route path="/" element={<HomePage />} />
      {/* 🌍 GLOBAL LAYOUT (Navbar + TopBar on all these pages) */}
      <Route element={<MainLayout />}>

        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />

        <Route path="/shop/:room" element={<RoomOverviewPage  />} />
        <Route path="/shop/:room/:category" element={<RoomCategoryPage />} />

        {/* Blog */}
        <Route path="/blog" element={<BlogGrid />} />
        <Route path="/blog/list" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/admin/blogs" element={<AdminBlogList />} />
        <Route path="/admin/blogs/new" element={<AdminCreateBlog />} />
        <Route path="/blog/write" element={<UserCreateBlog />} />



        <Route path="/search" element={<Search />} />
       

        {/* Info Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/gift-cards" element={<GiftCardsPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/gift-card/success" element={<GiftCardSuccess />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/my-gift-cards" element={<MyGiftCards />} />


        {/* Account / Orders */}
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/track" element={<TrackOrderPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/orders/:orderId" element={<OrdersTab />} />



        {/* Collections */}
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:category" element={<CategoryPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} /> 
        <Route path="/admin/messages" element={<AdminMessages />} />


        {/* Wishlist / Cart */}
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Admin */}
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
        <Route path="/admin/products/:id/edit" element={<ProductForm />} />

      </Route> {/* ✅ CLOSED PROPERLY */}

      {/* 🔐 AUTH ROUTES (NO NAVBAR) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/otp/:email" element={<OTPPage />} />
      <Route path="/reset-password/:email" element={<ResetPasswordPage />} />
      <Route path="/reset-success" element={<ResetSuccessPage />} />
      <Route path="/verify/:token" element={<VerifyEmail />} />
      <Route path="/verify-pending/:email" element={<VerifyPendingPage />} />

    </Routes>
  );
};

export default AppRoutes;
