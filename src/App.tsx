// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; // ADD THIS
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductsPage from './pages/Products';
import Orders from './pages/Orders';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import AboutPage from './components/Aboutus';
import ContactPage from './components/Contactus';
import PaymentMethods from './pages/PaymentMethods';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Wishlist from './pages/Wishlist'; // ADD THIS IMPORT

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider> {/* ADD THIS WRAPPER */}
          <div className="App">
            <ToastContainer 
              position="top-right" 
              autoClose={3000} 
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/contact-us" element={<ContactPage />} />
              
              {/* Add Wishlist Route */}
              <Route path="/wishlist" element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              <Route path="/orders" element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              } />
              
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
              
              <Route path="/payment-methods" element={
                <PrivateRoute>
                  <PaymentMethods />
                </PrivateRoute>
              } />
              
              <Route path="/notifications" element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              } />
              
              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;