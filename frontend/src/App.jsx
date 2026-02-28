import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MiniCart from './components/MiniCart'
import Login from "./pages/Login"
import Orders from "./pages/Order/Orders"
import Signup from "./pages/SignUp"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './components/ProductDetails';
import ReachOut from './pages/ReachOut';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetails from './pages/Order/OrderDetails';
import Addresses from './pages/Addresses';
import OurStory from './pages/OurStory';

// --- LEGAL PAGES ---
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';

import { SpeedInsights } from '@vercel/speed-insights/react';

// Helper to reset scroll position on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <MiniCart />

        <main className="flex-grow">
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Content */}
            <Route path="/" element={<Home />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/reach-out" element={<ReachOut />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />

            {/* Legal (Razorpay Requirements) */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />

            {/* Protected User Routes */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addresses"
              element={
                <ProtectedRoute>
                  <Addresses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;