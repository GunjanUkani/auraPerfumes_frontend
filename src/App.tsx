// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header'; // या Navigation
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
import ContactPage from 'components/Contactus';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header /> {/* Header को CartProvider के अंदर रखो */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          
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
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;