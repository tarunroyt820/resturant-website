import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/DashboardNavbar';
import { ShoppingBag, ArrowLeft, MapPin, CreditCard, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { cartItems, totalPrice, restaurantId, clearCart } = useCart();
  const { authFetch, API_URL, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !successState) {
      navigate('/customer-dashboard');
    }
  }, [cartItems]);

  // Form states
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successState, setSuccessState] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null);

  // Constants
  const deliveryFee = totalPrice > 30 ? 0.00 : 2.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + deliveryFee + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!deliveryAddress.trim()) {
      return setError('Please enter a delivery address.');
    }
    if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
      return setError('Please fill in card details.');
    }

    setLoading(true);

    try {
      // Map items for backend order creation
      const orderItems = cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // Issue Order API POST request
      const response = await authFetch(`${API_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify({
          restaurantId,
          totalPrice: grandTotal,
          deliveryAddress,
          items: orderItems
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setNewOrderId(data.orderId);
        setSuccessState(true);
        clearCart();
      } else {
        throw new Error(data.message || 'Failed to place order');
      }

    } catch (err) {
      setError(err.message || 'An error occurred while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successState) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-center items-center px-4">
        <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-gray-900">
            Order Placed!
          </h2>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            Your payment was processed successfully. The restaurant has been notified and is beginning to prepare your delicious food.
          </p>
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate(`/order-status/${newOrderId}`)}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Track Order Live</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/customer-dashboard')}
              className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 pb-20">
      <DashboardNavbar onCartClick={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-left">
        <Link 
          to="/customer-dashboard" 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>

        <h1 className="font-serif text-3xl font-extrabold text-gray-900 mb-8">
          Checkout Summary
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Forms */}
          <div className="lg:col-span-7 space-y-6">
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Delivery Address */}
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-bold text-gray-900">Delivery Details</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                    Delivery Address
                  </label>
                  <textarea
                    rows="3"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your street address, apartment number, zip code, and drop-off instructions..."
                    className="w-full bg-[#faf9f6] border border-gray-100 focus:border-orange-500 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium resize-none"
                    required
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-bold text-gray-900">Mock Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength="19"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-[#faf9f6] border border-gray-100 focus:border-orange-500 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-[#faf9f6] border border-gray-100 focus:border-orange-500 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        maxLength="3"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full bg-[#faf9f6] border border-gray-100 focus:border-orange-500 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/35 flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order (${grandTotal.toFixed(2)})</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Right Side: Order summary basket review */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-gray-900">Your Order Basket</h2>
            </div>

            {/* Items scroll */}
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.id} className="py-4 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded-xl border border-gray-50 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations block */}
            <div className="border-t border-gray-50 pt-4 space-y-3 text-sm font-semibold text-gray-500">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-50 pt-3">
                <span>Total Amount</span>
                <span className="text-orange-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
