import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import { 
  ClipboardList, Utensils, Plus, Edit, Trash2, Check, X, 
  AlertCircle, CheckCircle2, DollarSign, Loader2, Sparkles, Image 
} from 'lucide-react';

export default function RestaurantDashboard() {
  const { authFetch, API_URL, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Navigation tab state
  const activeTab = searchParams.get('tab') || 'orders';

  // Dashboard states
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Add/Edit menu item states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    category: '',
    description: '',
    image: ''
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Fetch restaurant profile
  const fetchRestaurantProfile = async () => {
    try {
      const response = await authFetch(`${API_URL}/restaurant/profile`);
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data);
        return data.id;
      }
    } catch (error) {
      console.error('Fetch restaurant profile error:', error);
    }
    return null;
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await authFetch(`${API_URL}/restaurant/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Fetch restaurant orders error:', error);
    }
  };

  // Fetch menu
  const fetchMenu = async () => {
    try {
      const response = await authFetch(`${API_URL}/restaurant/menu`);
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Fetch owner menu error:', error);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    await fetchRestaurantProfile();
    await fetchOrders();
    await fetchMenu();
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  // Update order status (Accept / Reject)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await authFetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (response.ok) {
        showMessage('success', `Order #${orderId} was updated to: ${newStatus}`);
        fetchOrders();
      } else {
        throw new Error(data.message || 'Status update failed');
      }
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Create menu item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setErrorState('');

    if (!formData.name || !formData.price || !formData.category) {
      return setErrorState('Please fill in Name, Price, and Category.');
    }

    try {
      const response = await authFetch(`${API_URL}/restaurant/menu`, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          description: formData.description,
          image: formData.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
        })
      });

      const data = await response.json();
      if (response.ok) {
        showMessage('success', 'Menu item created successfully!');
        setIsAddModalOpen(false);
        resetForm();
        fetchMenu();
      } else {
        throw new Error(data.message || 'Failed to create item');
      }
    } catch (error) {
      setErrorState(error.message);
    }
  };

  // Update menu item
  const handleEditMenuItem = async (e) => {
    e.preventDefault();
    setErrorState('');

    if (!formData.name || !formData.price || !formData.category) {
      return setErrorState('Please fill in Name, Price, and Category.');
    }

    try {
      const response = await authFetch(`${API_URL}/restaurant/menu/${formData.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          description: formData.description
        })
      });

      const data = await response.json();
      if (response.ok) {
        showMessage('success', 'Menu item updated successfully!');
        setIsEditModalOpen(false);
        resetForm();
        fetchMenu();
      } else {
        throw new Error(data.message || 'Failed to update item');
      }
    } catch (error) {
      setErrorState(error.message);
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      const response = await authFetch(`${API_URL}/restaurant/menu/${itemId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (response.ok) {
        showMessage('success', 'Menu item deleted successfully.');
        fetchMenu();
      } else {
        throw new Error(data.message || 'Failed to delete item');
      }
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  // Open modals
  const openEditModal = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description || '',
      image: item.image || ''
    });
    setErrorState('');
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', price: '', category: '', description: '', image: '' });
    setErrorState('');
  };

  const [errorState, setErrorState] = useState('');

  // Group pending orders
  const pendingOrders = orders.filter(order => order.status === 'Placed');
  const activeOrders = orders.filter(order => order.status === 'Preparing' || order.status === 'Delivering');
  const pastOrders = orders.filter(order => order.status === 'Delivered' || order.status === 'Rejected');

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 pb-20">
      <DashboardNavbar onCartClick={() => {}} />

      {/* Header Banner */}
      {restaurant && (
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.15),transparent)] pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Manage Your Business</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold mt-3">
                {restaurant.name}
              </h1>
              <p className="text-sm font-semibold text-gray-400 mt-1">
                Owner Dashboard for: <span className="text-gray-200">{user.name}</span> ({user.email})
              </p>
            </div>
            
            {/* Quick stats */}
            <div className="flex gap-6 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6 text-xs font-bold text-gray-300 shrink-0">
              <div>
                <p className="text-gray-500 uppercase tracking-wider">Pending Orders</p>
                <p className="text-2xl font-extrabold text-white mt-1">{pendingOrders.length}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase tracking-wider">Menu Dishes</p>
                <p className="text-2xl font-extrabold text-white mt-1">{menuItems.length}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Navigation tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => navigate('/restaurant-dashboard')}
            className={`py-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Incoming Orders</span>
            {pendingOrders.length > 0 && (
              <span className="bg-orange-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/restaurant-dashboard?tab=menu')}
            className={`py-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'menu'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Manage Menu</span>
          </button>
        </div>

        {/* Global Feedback message */}
        {message.text && (
          <div className={`mb-6 px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-sm border animate-fadeIn ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab 1: Incoming Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-10">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* 1. Pending (Placed) Section */}
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span>Pending Requests ({pendingOrders.length})</span>
                  </h2>

                  {pendingOrders.length === 0 ? (
                    <div className="text-center py-14 bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
                      <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-base font-bold text-gray-900">No pending orders</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        When clients order from your kitchen, they will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pendingOrders.map(order => (
                        <div 
                          key={order.id}
                          className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start border-b border-gray-50 pb-4 mb-4">
                              <div>
                                <span className="font-extrabold text-sm text-gray-900">Order #{order.id}</span>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <span className="text-orange-600 font-extrabold text-lg">
                                ${Number(order.total_price).toFixed(2)}
                              </span>
                            </div>

                            {/* Address details */}
                            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Delivery Address</p>
                            <p className="text-sm text-gray-600 mt-1 mb-4 leading-relaxed font-semibold">{order.delivery_address}</p>

                            {/* Ordered items details */}
                            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Ordered Items</p>
                            <ul className="mt-2 space-y-1.5 mb-6 text-sm font-semibold text-gray-500">
                              {order.items?.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                  <span>Dish #{item.menu_item_id} (Qty: {item.quantity})</span>
                                  <span>${Number(item.price).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Accept / Reject Buttons */}
                          <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-50">
                            <button
                              disabled={actionLoading}
                              onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')}
                              className="py-3 bg-green-600 hover:bg-green-500 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all text-sm"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleUpdateOrderStatus(order.id, 'Rejected')}
                              className="py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-200 rounded-xl flex items-center justify-center gap-1.5 transition-all text-sm"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Active Orders (Preparing/Delivering) */}
                <div className="text-left pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                    <span>In Progress ({activeOrders.length})</span>
                  </h2>

                  {activeOrders.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
                      <p className="text-xs text-gray-400 font-bold">No active orders currently cooking or delivering.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {activeOrders.map(order => (
                        <div key={order.id} className="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between">
                          <div className="flex justify-between items-center pb-3 border-b border-gray-50 mb-3 text-sm">
                            <span className="font-bold text-gray-800">Order #{order.id}</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              order.status === 'Preparing' ? 'bg-amber-55 text-amber-700' : 'bg-purple-50 text-purple-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-500 leading-relaxed font-semibold max-w-xs truncate mb-4">
                            Addr: {order.delivery_address}
                          </p>

                          <div className="pt-3 border-t border-gray-50 mt-auto">
                            {order.status === 'Preparing' ? (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Delivering')}
                                className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs transition-colors"
                              >
                                Dispatch Order
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                                className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-xs transition-colors"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Past Orders (Delivered/Rejected) */}
                <div className="text-left pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 bg-gray-400 rounded-full" />
                    <span>Completed History ({pastOrders.length})</span>
                  </h2>

                  {pastOrders.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm max-w-md">
                      <div className="p-4 bg-gray-50 font-bold text-xs text-gray-500 uppercase tracking-widest border-b border-gray-100">
                        Recent History Logs
                      </div>
                      <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                        {pastOrders.map(order => (
                          <div key={order.id} className="p-4 flex justify-between items-center text-sm font-semibold">
                            <div>
                              <p className="text-gray-900">Order #{order.id}</p>
                              <p className="text-xs text-gray-400 mt-0.5">${Number(order.total_price).toFixed(2)}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Manage Menu */}
        {activeTab === 'menu' && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-extrabold text-gray-900">
                Menu Management
              </h2>
              <button
                onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Add Dish Item</span>
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Your Menu is empty</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Create delicious culinary options to serve to your clients!
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-[#faf9f6]">
                      <tr>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest text-left">Dish Info</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest text-left">Category</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest text-left">Price</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest text-left">Description</th>
                        <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {menuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-[#faf9f6]/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80'} 
                                alt={item.name} 
                                className="w-10 h-10 object-cover rounded-lg border border-gray-50 shrink-0"
                              />
                              <span className="font-extrabold text-sm text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-extrabold">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900">
                            ${Number(item.price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 font-medium max-w-xs truncate">
                            {item.description || 'No description provided.'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                                title="Edit Dish"
                              >
                               <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMenuItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete Dish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

      {/* --- ADD MENU ITEM MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative z-10 shadow-2xl border border-gray-100 text-left max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-extrabold text-gray-900 font-serif mb-6">Add New Dish</h3>
            {errorState && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-xl text-xs font-bold">{errorState}</div>}
            
            <form onSubmit={handleAddMenuItem} className="space-y-4">
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Dish Name</label>
                <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#faf9f6] border rounded-xl px-4 py-2.5 text-sm" placeholder="Margherita Pizza" required />
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Price ($)</label>
                <input type="number" step="0.01" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} className="w-full bg-[#faf9f6] border rounded-xl px-4 py-2.5 text-sm" placeholder="12.99" required />
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                <input type="text" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full bg-[#faf9f6] border rounded-xl px-4 py-2.5 text-sm" placeholder="Pizza, Sides, Appetizer" required />
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                <textarea rows="2" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full bg-[#faf9f6] border rounded-xl px-4 py-2.5 text-sm" placeholder="Short description of ingredients..." />
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Dish Image URL (Optional)</label>
                <input type="text" value={formData.image} onChange={(e)=>setFormData({...formData, image: e.target.value})} className="w-full bg-[#faf9f6] border rounded-xl px-4 py-2.5 text-sm" placeholder="https://unsplash.com/..." />
              </div>
              <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl mt-4">Save Dish</button>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MENU ITEM MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative z-10 shadow-2xl border border-gray-100 text-left max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-extrabold text-gray-900 font-serif mb-6">Edit Dish Item</h3>
            {errorState && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-xl text-xs font-bold">{errorState}</div>}
            
            <form onSubmit={handleEditMenuItem} className="space-y-4">
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Dish Name</label>
                <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#faf9f6] border rounded-xl px-4 py-2.5 text-sm" required />
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Price ($)</label>
                <input type="number" step="0.01" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} className="w-full bg-[#faf9f6] border rounded-xl px-4 py-2.5 text-sm" required />
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                <input type="text" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full bg-[#faf9f6] border rounded-xl px-4 py-2.5 text-sm" required />
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                <textarea rows="2" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full bg-[#faf9f6] border rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl mt-4">Update Dish</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
