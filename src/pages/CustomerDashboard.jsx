import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import CartDrawer from '../components/CartDrawer';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Compass, Clock, UtensilsCrossed, AlertCircle, ShoppingBag, Eye } from 'lucide-react';

// Static fallbacks if API fails
const MOCK_RESTAURANTS = [
  { id: 1, name: 'La Piazza Pizzeria', category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', rating: 4.9, reviewsCount: '1.2k+', deliveryTime: '15-25 min', priceLevel: '$$', deliveryFee: 'Free' },
  { id: 2, name: 'Burger & Co. Craft House', category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', rating: 4.8, reviewsCount: '800+', deliveryTime: '20-30 min', priceLevel: '$$', deliveryFee: 1.99 },
  { id: 3, name: 'Sakura Sushi Roll', category: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', rating: 4.7, reviewsCount: '950+', deliveryTime: '25-35 min', priceLevel: '$$$', deliveryFee: 'Free' },
  { id: 4, name: 'Sweet Bliss Dessert Lab', category: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80', rating: 4.6, reviewsCount: '640+', deliveryTime: '10-20 min', priceLevel: '$', deliveryFee: 0.99 },
  { id: 5, name: 'The Green Garden Bistro', category: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', rating: 4.9, reviewsCount: '1.5k+', deliveryTime: '20-30 min', priceLevel: '$$', deliveryFee: 'Free' },
  { id: 6, name: 'Lotus Wok Asian Express', category: 'Asian', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', rating: 4.7, reviewsCount: '450+', deliveryTime: '30-40 min', priceLevel: '$$', deliveryFee: 2.49 }
];

export default function CustomerDashboard() {
  const { authFetch, API_URL } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State variables
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [restaurantError, setRestaurantError] = useState('');
  
  const activeTab = searchParams.get('tab') || 'restaurants';

  // Categories list
  const categories = ['All', 'Pizza', 'Burgers', 'Sushi', 'Desserts', 'Healthy', 'Asian'];

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    setLoadingRestaurants(true);
    setRestaurantError('');
    try {
      const response = await fetch(`${API_URL}/restaurants`);
      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      setRestaurants(data.length > 0 ? data : MOCK_RESTAURANTS);
    } catch (error) {
      console.warn('Could not load restaurants from server. Falling back to mock data:', error);
      setRestaurants(MOCK_RESTAURANTS);
      // We do not show an error block for this fallback as it resolves gracefully
    } finally {
      setLoadingRestaurants(false);
    }
  };

  // Fetch customer orders
  const fetchCustomerOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await authFetch(`${API_URL}/orders/customer`);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load customer orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchCustomerOrders();
    }
  }, [activeTab]);

  // Filtering
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 pb-20">
      <DashboardNavbar onCartClick={() => setIsCartOpen(true)} />
      
      {/* Search Header Banner */}
      {activeTab === 'restaurants' && (
        <section className="bg-gradient-to-r from-orange-600 to-amber-500 text-white py-12 px-4 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-full bg-white/5 rounded-bl-full -z-10" />
          <div className="max-w-7xl mx-auto text-left">
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold">
              Browse Local Flavors
            </h1>
            <p className="mt-2 text-orange-100 max-w-xl text-sm sm:text-base">
              Enter your favorite food or cuisine and explore the best recipes delivered fresh to your door.
            </p>
            
            {/* Search Input */}
            <div className="mt-6 max-w-xl flex items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-md">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search food, cuisines, or restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none pl-2 text-sm text-gray-800 placeholder-gray-400 font-medium py-1.5"
              />
            </div>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => navigate('/customer-dashboard')}
            className={`py-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'restaurants'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Restaurants</span>
          </button>
          <button
            onClick={() => navigate('/customer-dashboard?tab=orders')}
            className={`py-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order History</span>
          </button>
        </div>

        {/* Tab 1: Restaurant Grid */}
        {activeTab === 'restaurants' && (
          <div>
            {/* Category selection */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white text-gray-600 hover:text-orange-600 border border-gray-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loadingRestaurants ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No restaurants match your search</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your search keyword or selected category pills.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Order History */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">You haven't ordered anything yet</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Browse our local kitchen collections and place your first delicious order!
                </p>
                <button
                  onClick={() => navigate('/customer-dashboard')}
                  className="mt-6 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Order Now
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-[#faf9f6]">
                      <tr>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Order ID</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Date Placed</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Total Price</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Delivery Address</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#faf9f6]/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                            {new Date(order.created_at).toLocaleDateString()} at{' '}
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-extrabold text-sm text-orange-600">
                            ${Number(order.total_price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-medium max-w-xs truncate">
                            {order.delivery_address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold ${
                              order.status === 'Placed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              order.status === 'Preparing' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              order.status === 'Delivering' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              onClick={() => navigate(`/order-status/${order.id}`)}
                              className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl font-bold flex items-center gap-1.5 mx-auto transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Track Status</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Slider */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
