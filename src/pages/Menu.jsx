import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import DashboardNavbar from '../components/DashboardNavbar';
import CartDrawer from '../components/CartDrawer';
import { ArrowLeft, Clock, Star, Plus, CheckCircle, AlertCircle, UtensilsCrossed } from 'lucide-react';

// Curated Mock Menu items if API fails or is empty
const MOCK_MENU = {
  // Pizzeria items
  1: [
    { id: 1, name: 'Margherita Classic Pizza', description: 'Fresh tomatoes, mozzarella cheese, fresh basil, and extra virgin olive oil.', price: 14.99, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=400&q=80', category: 'Pizza' },
    { id: 2, name: 'Spicy Pepperoni Feast', description: 'Double pepperoni, hot honey drizzle, fresh mozzarella, and tomato base.', price: 17.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80', category: 'Pizza' },
    { id: 3, name: 'Truffle Mushroom Pizza', description: 'White sauce, wild mushroom blend, white truffle oil, and shaved parmesan.', price: 19.99, image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&w=400&q=80', category: 'Pizza' },
    { id: 4, name: 'Caprese Salad', description: 'Buffalo mozzarella, heirloom tomatoes, balsamic glaze, and pesto sauce.', price: 9.99, image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=80', category: 'Sides' }
  ],
  // Burger items
  2: [
    { id: 5, name: 'Signature Bacon Cheese Burger', description: 'Angus beef patty, crispy smoked bacon, cheddar cheese, caramelized onions, house burger sauce.', price: 13.49, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', category: 'Burgers' },
    { id: 6, name: 'Truffle Garlic Fries', description: 'Crisp double-fried potatoes tossed in white truffle oil, parsley, and garlic aioli.', price: 5.99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80', category: 'Sides' },
    { id: 7, name: 'Crispy Hot Chicken Burger', description: 'Crispy buttermilk chicken breast, sweet pickles, spicy coleslaw, cayenne butter sauce.', price: 12.99, image: 'https://images.unsplash.com/photo-1627662236973-4f8259fa2441?auto=format&fit=crop&w=400&q=80', category: 'Burgers' }
  ],
  // Default other items
  default: [
    { id: 10, name: 'Special Gourmet Pasta', description: 'Signature home-cooked creamy alfredo recipe topped with roasted chicken slices.', price: 15.99, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=400&q=80', category: 'Main Course' },
    { id: 11, name: 'Garlic Knots Bread', description: 'Baked knots rolled in garlic butter, fresh parsley, and freshly grated parmesan.', price: 6.99, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=400&q=80', category: 'Appetizers' },
    { id: 12, name: 'Signature Chocolate Mousse', description: 'Smooth, double whipped rich dark Belgian chocolate mousse with raspberry coulis.', price: 7.99, image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=400&q=80', category: 'Dessert' }
  ]
};

// Static mock restaurant headers if API fails
const MOCK_RESTAURANT_HEADERS = {
  1: { name: 'La Piazza Pizzeria', category: 'Pizza', rating: 4.9, deliveryTime: '15-25 min' },
  2: { name: 'Burger & Co. Craft House', category: 'Burgers', rating: 4.8, deliveryTime: '20-30 min' },
  3: { name: 'Sakura Sushi Roll', category: 'Sushi', rating: 4.7, deliveryTime: '25-35 min' },
  4: { name: 'Sweet Bliss Dessert Lab', category: 'Desserts', rating: 4.6, deliveryTime: '10-20 min' },
  5: { name: 'The Green Garden Bistro', category: 'Healthy', rating: 4.9, deliveryTime: '20-30 min' },
  6: { name: 'Lotus Wok Asian Express', category: 'Asian', rating: 4.7, deliveryTime: '30-40 min' }
};

export default function Menu() {
  const { restaurantId } = useParams();
  const { API_URL } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  // States
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState({});

  const fetchMenuAndRestaurant = async () => {
    setLoading(true);
    try {
      // 1. Fetch menu items
      const menuRes = await fetch(`${API_URL}/menu/${restaurantId}`);
      let itemsData = [];
      if (menuRes.ok) {
        itemsData = await menuRes.json();
      }

      // If database contains items, use them, else fallback to mock menu
      if (itemsData && itemsData.length > 0) {
        setMenuItems(itemsData);
      } else {
        setMenuItems(MOCK_MENU[restaurantId] || MOCK_MENU.default);
      }

      // 2. Fetch restaurant details
      const restaurantsRes = await fetch(`${API_URL}/restaurants`);
      let rData = null;
      if (restaurantsRes.ok) {
        const list = await restaurantsRes.json();
        rData = list.find(r => String(r.id) === String(restaurantId));
      }
      
      if (rData) {
        setRestaurant(rData);
      } else {
        // Fallback header
        setRestaurant(MOCK_RESTAURANT_HEADERS[restaurantId] || {
          name: 'Gourmet Kitchen',
          category: 'Cuisine',
          rating: 4.5,
          deliveryTime: '25-35 min'
        });
      }

    } catch (error) {
      console.warn('API error loading menu. Using fallback mock data:', error);
      setMenuItems(MOCK_MENU[restaurantId] || MOCK_MENU.default);
      setRestaurant(MOCK_RESTAURANT_HEADERS[restaurantId] || {
        name: 'Gourmet Kitchen',
        category: 'Cuisine',
        rating: 4.5,
        deliveryTime: '25-35 min'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuAndRestaurant();
  }, [restaurantId]);

  const handleAddToCart = (item) => {
    const success = addToCart(item, restaurantId);
    if (success) {
      // Trigger a quick successful addition tick overlay on the specific item card
      setAddedAnimation(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedAnimation(prev => ({ ...prev, [item.id]: false }));
      }, 1500);
    }
  };

  // Group menu items by category
  const categoriesMap = menuItems.reduce((map, item) => {
    const cat = item.category || 'Other';
    if (!map[cat]) map[cat] = [];
    map[cat].push(item);
    return map;
  }, {});

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 pb-20">
      <DashboardNavbar onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Banner Header */}
      {restaurant && (
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-14 px-4 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.15),transparent)] pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left relative z-10">
            <div>
              {/* Back to Browse */}
              <Link 
                to="/customer-dashboard" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors uppercase tracking-widest mb-4"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
                <span>Back to Restaurants</span>
              </Link>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-orange-600 text-white font-extrabold text-[10px] uppercase rounded-full tracking-wider">
                  {restaurant.category}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold mt-3">
                {restaurant.name}
              </h1>
            </div>

            {/* Restaurant Meta Details */}
            <div className="flex gap-6 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6 text-sm font-bold text-gray-300 shrink-0">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span className="text-white">{restaurant.rating || '4.5'}</span>
                <span className="text-xs font-semibold text-gray-400">({restaurant.reviewsCount || '100+'})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>{restaurant.deliveryTime || '20-30 min'}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main menu container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No dishes available yet</h3>
            <p className="text-sm text-gray-500 mt-2">
              This restaurant has not populated their culinary menu details.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.keys(categoriesMap).map((catName) => (
              <div key={catName} className="text-left">
                {/* Category header */}
                <h2 className="text-2xl font-serif font-extrabold text-gray-900 border-b border-gray-100 pb-3 mb-6">
                  {catName}
                </h2>

                {/* Items layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoriesMap[catName].map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-center relative overflow-hidden group"
                    >
                      {/* Left: Info details */}
                      <div className="flex-1 flex flex-col justify-between h-full min-w-0">
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-base group-hover:text-orange-600 transition-colors truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                            {item.description || 'Gourmet recipe cooked with fresh ingredients, seasoned chefs preparation.'}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-orange-600 font-extrabold text-lg">
                            ${Number(item.price).toFixed(2)}
                          </span>
                          
                          {/* Add to Basket button */}
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Dish Image */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-gray-50">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=150&q=80'} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Animated addition tick overlay */}
                        {addedAnimation[item.id] && (
                          <div className="absolute inset-0 bg-green-600/90 backdrop-blur-xs flex items-center justify-center text-white animate-fadeIn">
                            <CheckCircle className="w-8 h-8 animate-bounce" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
