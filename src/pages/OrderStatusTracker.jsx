import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/DashboardNavbar';
import { ArrowLeft, Clock, MapPin, CheckCircle2, ChevronRight, Loader2, Sparkles, Navigation } from 'lucide-react';

export default function OrderStatusTracker() {
  const { orderId } = useParams();
  const { authFetch, API_URL } = useAuth();
  const navigate = useNavigate();

  // Tracker states
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch single order details
  const fetchOrderStatus = async () => {
    try {
      const response = await authFetch(`${API_URL}/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Could not retrieve order details');
      }
      const data = await response.json();
      setOrder(data);
      setError('');
    } catch (err) {
      console.error('Fetch order status error:', err);
      setError('Could not retrieve live tracker updates. Re-attempting...');
    } finally {
      setLoading(false);
    }
  };

  // Poll API every 5 seconds for status updates
  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Map status to progress step index
  const getStatusIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Preparing': return 1;
      case 'Delivering': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Sent to restaurant' },
    { title: 'Preparing', desc: 'Cooking your recipe' },
    { title: 'Delivering', desc: 'Driver is on the way' },
    { title: 'Delivered', desc: 'Enjoy your food!' }
  ];

  const activeIndex = order ? getStatusIndex(order.status) : 0;

  // Mock estimated delivery time math based on current status
  const getEstTime = (status) => {
    switch (status) {
      case 'Placed': return '25-35 mins';
      case 'Preparing': return '15-20 mins';
      case 'Delivering': return '5-10 mins';
      case 'Delivered': return 'Arrived';
      default: return 'Calculating...';
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 pb-20">
      <DashboardNavbar onCartClick={() => {}} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-left">
        <Link 
          to="/customer-dashboard?tab=orders" 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order History</span>
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[32px] shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-500 font-bold text-sm">Loading Live Tracker Data...</p>
          </div>
        ) : error && !order ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header Tracker Info */}
            <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full text-xs font-bold text-orange-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Tracking Active</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mt-2">
                    Order #{order.id}
                  </h1>
                  <p className="text-sm font-semibold text-gray-400 mt-1">
                    From: <span className="text-gray-700 font-bold">{order.restaurantName}</span>
                  </p>
                </div>
                <div className="sm:text-right bg-orange-600/5 border border-orange-500/10 p-4 rounded-2xl shrink-0">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Estimated Arrival</p>
                  <p className="text-2xl font-extrabold text-orange-600 mt-1">
                    {getEstTime(order.status)}
                  </p>
                </div>
              </div>

              {/* Progress Steps UI */}
              <div className="py-6">
                {/* Desktop timeline horizontal */}
                <div className="hidden sm:flex justify-between items-center relative">
                  {/* Background Progress bar */}
                  <div className="absolute top-5 left-1/10 right-1/10 h-1 bg-gray-100 -z-10" />
                  <div 
                    className="absolute top-5 left-1/10 h-1 bg-orange-500 -z-10 transition-all duration-500" 
                    style={{ width: `${(activeIndex / 3) * 80}%` }}
                  />

                  {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center w-1/4 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm border-4 transition-all duration-300 ${
                        idx < activeIndex ? 'bg-orange-600 border-orange-100 text-white' :
                        idx === activeIndex ? 'bg-white border-orange-600 text-orange-600 shadow-md shadow-orange-500/10 scale-110' :
                        'bg-white border-gray-100 text-gray-300'
                      }`}>
                        {idx < activeIndex ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <p className={`text-sm font-bold mt-3 ${idx <= activeIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Mobile timeline vertical */}
                <div className="sm:hidden space-y-8 pl-4 relative border-l-2 border-gray-100">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className={`absolute -left-3.5 top-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border-2 transition-all duration-300 ${
                        idx < activeIndex ? 'bg-orange-600 border-orange-100 text-white' :
                        idx === activeIndex ? 'bg-white border-orange-600 text-orange-600 scale-110' :
                        'bg-white border-gray-200 text-gray-300'
                      }`}>
                        {idx < activeIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <h4 className={`text-sm font-extrabold ${idx <= activeIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Delivery address & items summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Address details */}
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm text-left">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-4">
                  <Navigation className="w-5 h-5 text-orange-500" />
                  <h3 className="text-base font-bold text-gray-900">Destination</h3>
                </div>
                <p className="text-sm font-bold text-gray-700">Delivery Address:</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{order.delivery_address}</p>
              </div>

              {/* Order total info */}
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-4">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <h3 className="text-base font-bold text-gray-900">Billing details</h3>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                    <span>Payment Method:</span>
                    <span className="text-gray-700">Mock Card Payment</span>
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-4">
                  <span className="text-sm font-bold text-gray-500">Grand Total paid:</span>
                  <span className="text-2xl font-extrabold text-orange-600">
                    ${Number(order.total_price).toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
}
