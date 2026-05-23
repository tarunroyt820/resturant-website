import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OrderStatusTracker from './pages/OrderStatusTracker';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Customer Routes */}
            <Route 
              path="/customer-dashboard" 
              element={
                <ProtectedRoute allowedRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/menu/:restaurantId" 
              element={
                <ProtectedRoute allowedRole="customer">
                  <Menu />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute allowedRole="customer">
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-status/:orderId" 
              element={
                <ProtectedRoute allowedRole="customer">
                  <OrderStatusTracker />
                </ProtectedRoute>
              } 
            />

            {/* Protected Restaurant Routes */}
            <Route 
              path="/restaurant-dashboard" 
              element={
                <ProtectedRoute allowedRole="restaurant">
                  <RestaurantDashboard />
                </ProtectedRoute>
              } 
            />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

