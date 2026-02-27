import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MiniCart from './components/MiniCart'
import Login from "./pages/Login"
import Orders from "./pages/Order/Orders"

import Signup from "./pages/SignUp"


import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from './components/layout/Navbar';

import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing'; // Import your new listing page
import ProductDetails from './components/ProductDetails';

import ReachOut from './pages/ReachOut';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetails from './pages/Order/OrderDetails';
import Addresses from './pages/Addresses';
import { SpeedInsights } from '@vercel/speed-insights/react';
import OurStory from './pages/OurStory';




function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">

        <Navbar />

        <MiniCart />

        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/our-story" element={<OurStory />} />

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
              path="/checkout"
              element={

                <Checkout />

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

            <Route path="/order-success/:id" element={<OrderSuccess />} />

            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/reach-out" element={<ReachOut />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </Router>)
}

export default App;