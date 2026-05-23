import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, LogOut, User, ClipboardList, Utensils } from 'lucide-react';

export default function DashboardNavbar({ onCartClick }) {
  const { user, logout } = useAuth();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-2.5 rounded-2xl">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              BiteSwift
            </span>
          </Link>

          {/* Role specific link menus */}
          <nav className="flex items-center gap-6">
            {user?.role === 'customer' ? (
              <>
                <Link 
                  to="/customer-dashboard" 
                  className="font-bold text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Browse Food
                </Link>
                <Link 
                  to="/customer-dashboard?tab=orders" 
                  className="font-bold text-sm text-gray-600 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>My Orders</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/restaurant-dashboard" 
                  className="font-bold text-sm text-gray-600 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Incoming Orders</span>
                </Link>
                <Link 
                  to="/restaurant-dashboard?tab=menu" 
                  className="font-bold text-sm text-gray-600 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Manage Menu</span>
                </Link>
              </>
            )}
          </nav>

          {/* User profile & Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button (Customers only) */}
            {user?.role === 'customer' && (
              <button 
                onClick={onCartClick}
                className="relative p-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-full transition-all duration-200"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </button>
            )}

            {/* Profile Tag */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#faf9f6] rounded-full border border-gray-100">
              <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-extrabold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-bold text-gray-700 hidden sm:inline">
                {user?.name || 'User'}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
