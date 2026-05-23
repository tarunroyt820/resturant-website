import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  ChevronRight, 
  Menu, 
  X, 
  ShoppingBag, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ChefHat, 
  Navigation, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Utensils, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export default function LandingPage() {
  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  
  // Search and filter states
  const [searchAddress, setSearchAddress] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState({});
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Sample data
  const categories = [
    { id: 'All', name: 'All Food', icon: Utensils },
    { id: 'Pizza', name: 'Pizza', icon: '🍕' },
    { id: 'Burgers', name: 'Burgers', icon: '🍔' },
    { id: 'Sushi', name: 'Sushi', icon: '🍣' },
    { id: 'Desserts', name: 'Desserts', icon: '🍰' },
    { id: 'Healthy', name: 'Healthy', icon: '🥗' },
    { id: 'Asian', name: 'Asian', icon: '🍜' },
  ];

  const restaurants = [
    {
      id: 1,
      name: 'La Piazza Pizzeria',
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviewsCount: '1.2k+',
      deliveryTime: '15-25 min',
      priceLevel: '$$',
      deliveryFee: 'Free',
      tag: 'Chef Choice',
      isPopular: true
    },
    {
      id: 2,
      name: 'Burger & Co. Craft House',
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      reviewsCount: '800+',
      deliveryTime: '20-30 min',
      priceLevel: '$$',
      deliveryFee: '$1.99',
      tag: 'Trending',
      isPopular: true
    },
    {
      id: 3,
      name: 'Sakura Sushi Roll',
      category: 'Sushi',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      reviewsCount: '950+',
      deliveryTime: '25-35 min',
      priceLevel: '$$$',
      deliveryFee: 'Free',
      tag: 'Top Rated',
      isPopular: false
    },
    {
      id: 4,
      name: 'Sweet Bliss Dessert Lab',
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
      rating: 4.6,
      reviewsCount: '640+',
      deliveryTime: '10-20 min',
      priceLevel: '$',
      deliveryFee: '$0.99',
      tag: 'Sweet Deal',
      isPopular: false
    },
    {
      id: 5,
      name: 'The Green Garden Bistro',
      category: 'Healthy',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviewsCount: '1.5k+',
      deliveryTime: '20-30 min',
      priceLevel: '$$',
      deliveryFee: 'Free',
      tag: 'Healthy Living',
      isPopular: true
    },
    {
      id: 6,
      name: 'Lotus Wok Asian Express',
      category: 'Asian',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      reviewsCount: '450+',
      deliveryTime: '30-40 min',
      priceLevel: '$$',
      deliveryFee: '$2.49',
      tag: 'Fast Cooking',
      isPopular: false
    }
  ];

  const filteredRestaurants = activeCategory === 'All' 
    ? restaurants 
    : restaurants.filter(r => r.category === activeCategory);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      alert(`Finding delicious meals near: "${searchAddress}"`);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-300">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                BiteSwift
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#hero" className="font-semibold text-gray-600 hover:text-orange-600 transition-colors">Home</a>
              <a href="#features" className="font-semibold text-gray-600 hover:text-orange-600 transition-colors">Why Us</a>
              <a href="#menu" className="font-semibold text-gray-600 hover:text-orange-600 transition-colors">Explore</a>
              <a href="#about" className="font-semibold text-gray-600 hover:text-orange-600 transition-colors">Partnership</a>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => { setAuthMode('login'); setIsLoginModalOpen(true); }}
                className="px-6 py-2.5 font-bold text-gray-700 hover:text-orange-600 rounded-full transition-all duration-200"
              >
                Log In
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setIsLoginModalOpen(true); }}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-orange-600 focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 px-4 flex flex-col gap-4 animate-fadeIn">
            <a 
              href="#hero" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-semibold text-lg text-gray-700 hover:text-orange-600 py-2 border-b border-gray-50 transition-colors"
            >
              Home
            </a>
            <a 
              href="#features" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-semibold text-lg text-gray-700 hover:text-orange-600 py-2 border-b border-gray-50 transition-colors"
            >
              Why Us
            </a>
            <a 
              href="#menu" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-semibold text-lg text-gray-700 hover:text-orange-600 py-2 border-b border-gray-50 transition-colors"
            >
              Explore
            </a>
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-semibold text-lg text-gray-700 hover:text-orange-600 py-2 border-b border-gray-50 transition-colors"
            >
              Partnership
            </a>
            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setAuthMode('login'); setIsLoginModalOpen(true); }}
                className="w-full py-3 text-center font-bold text-gray-700 hover:text-orange-600 border border-gray-200 rounded-full transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setAuthMode('signup'); setIsLoginModalOpen(true); }}
                className="w-full py-3 text-center bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold rounded-full shadow-lg shadow-orange-500/10"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-6 pb-20 md:py-24 lg:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 rounded-bl-[100px] -z-10 hidden lg:block" />
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full w-fit mb-6 animate-pulse">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700 font-bold text-sm">Super Fast Delivery in Your Town</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Craving food? <br />
                We deliver it <br />
                <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent italic font-normal">
                  hot & fresh.
                </span>
              </h1>

              <p className="mt-6 text-gray-600 text-lg sm:text-xl max-w-xl leading-relaxed">
                Connect with the best local kitchens. Browse menus, customize your dishes, and track your feast in real-time.
              </p>

              {/* Delivery Address Search */}
              <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl">
                <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl sm:rounded-full shadow-xl shadow-gray-200/80 border border-gray-100">
                  <div className="flex items-center gap-2 px-3 flex-1">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                    <input 
                      type="text" 
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="Enter your delivery address..."
                      className="w-full py-2 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-xl sm:rounded-full shadow-lg shadow-orange-500/30 transition-all duration-200"
                  >
                    <Search className="w-5 h-5" />
                    Find Food
                  </button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  href="#menu" 
                  className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Explore Menu
                </a>
                <button 
                  onClick={() => { setAuthMode('login'); setIsLoginModalOpen(true); }}
                  className="px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-2xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200"
                >
                  Login to Order
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-gray-100 pt-8 max-w-lg">
                <div>
                  <p className="text-3xl font-extrabold text-gray-900">500+</p>
                  <p className="text-sm font-semibold text-gray-500 mt-1">Partners</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-gray-900">10k+</p>
                  <p className="text-sm font-semibold text-gray-500 mt-1">Deliveries</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-gray-900">4.9/5</p>
                  <p className="text-sm font-semibold text-gray-500 mt-1">User Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="lg:col-span-5 relative mt-10 lg:mt-0 flex justify-center">
              {/* Circular Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 lg:w-[480px] h-72 sm:h-96 lg:h-[480px] bg-gradient-to-tr from-orange-100 to-amber-100 rounded-full -z-10 blur-xl" />

              {/* Main Food Image */}
              <div className="relative max-w-md w-full aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" 
                  alt="Delicious premium food spread" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badge 1 - Super Fast */}
              <div className="absolute top-12 -left-8 bg-white border border-gray-100 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="bg-orange-500/10 p-2.5 rounded-xl">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Delivery</p>
                  <p className="text-sm font-extrabold text-gray-900">30 Mins Guaranteed</p>
                </div>
              </div>

              {/* Badge 2 - High rating */}
              <div className="absolute -bottom-6 -right-4 bg-white border border-gray-100 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '6s' }}>
                <div className="bg-amber-500/10 p-2.5 rounded-xl">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900">4.9 Stars</p>
                  <p className="text-xs font-semibold text-gray-500">Over 15k+ Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL FEATURES SECTION */}
      <section id="features" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900">
              Why Hungry Customers Choose Us
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              We focus on delivering high-quality, hot meals from your favorite local dining hotspots straight to you, with top-tier service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-b from-[#faf9f6] to-white border border-gray-100 p-8 rounded-3xl hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-orange-500/10 group-hover:bg-orange-500 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
                <Clock className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Super Fast Delivery</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Your hot food is priority number one. Our routing algorithm matches you with the fastest courier to guarantee under-30-minute delivery.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-b from-[#faf9f6] to-white border border-gray-100 p-8 rounded-3xl hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-orange-500/10 group-hover:bg-orange-500 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
                <ShieldCheck className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Trusted Restaurants</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                We partner only with kitchens that hold absolute health certificates, premium reviews, and strict hygiene standards. Taste only the best.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-b from-[#faf9f6] to-white border border-gray-100 p-8 rounded-3xl hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-orange-500/10 group-hover:bg-orange-500 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
                <ChefHat className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Chef-Curated Menus</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Exclusive culinary partnerships bringing gourmet food items right to your kitchen table. Enjoy delicious diversity from gourmet cooks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MENU / DISCOVER SECTION */}
      <section id="menu" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full mb-4">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 font-bold text-xs">Trending Culinary Choices</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 text-left">
                Explore Delicious Cuisines
              </h2>
            </div>
            
            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mt-6 md:mt-0 scrollbar-none max-w-full">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                      activeCategory === cat.id
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                        : 'bg-white text-gray-600 hover:text-orange-600 hover:bg-orange-50 border border-gray-100'
                    }`}
                  >
                    {typeof cat.icon === 'string' ? (
                      <span className="text-base">{cat.icon}</span>
                    ) : (
                      <IconComponent className="w-4 h-4" />
                    )}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Restaurant Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <div 
                key={restaurant.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Image and badges */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {restaurant.tag}
                  </div>
                  <button 
                    onClick={() => toggleFavorite(restaurant.id)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${favorites[restaurant.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col text-left">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded-md">
                      {restaurant.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-extrabold text-gray-900">{restaurant.rating}</span>
                      <span className="text-xs font-semibold text-gray-400">({restaurant.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {restaurant.name}
                  </h3>

                  {/* Delivery stats */}
                  <div className="flex items-center gap-4 mt-4 py-3 border-t border-gray-50 text-gray-500 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      <span>{restaurant.priceLevel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto text-orange-600 font-extrabold">
                      <span>Delivery: {restaurant.deliveryFee}</span>
                    </div>
                  </div>

                  {/* Order Button */}
                  <button 
                    onClick={() => alert(`Ordering from ${restaurant.name}!`)}
                    className="mt-6 w-full py-3.5 bg-[#faf9f6] group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-amber-500 text-gray-700 group-hover:text-white font-bold rounded-2xl flex items-center justify-center gap-2 border border-gray-100 group-hover:border-transparent transition-all duration-300"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-orange-600 text-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-extrabold text-sm uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full">
              Seamless Ordering Flow
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold mt-6">
              How BiteSwift Delivers Joy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white text-orange-600 rounded-3xl flex items-center justify-center font-extrabold text-3xl shadow-xl shadow-orange-700/35 relative mb-6 group-hover:rotate-6 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold">Select Location</h3>
              <p className="mt-3 text-orange-100 max-w-xs text-sm leading-relaxed">
                Type in your delivery address to explore all the available menus from open local kitchens.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white text-orange-600 rounded-3xl flex items-center justify-center font-extrabold text-3xl shadow-xl shadow-orange-700/35 relative mb-6 group-hover:rotate-6 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold">Choose Delicious Meal</h3>
              <p className="mt-3 text-orange-100 max-w-xs text-sm leading-relaxed">
                Add premium courses to your cart, customize toppings or sides, and process your secure payment.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white text-orange-600 rounded-3xl flex items-center justify-center font-extrabold text-3xl shadow-xl shadow-orange-700/35 relative mb-6 group-hover:rotate-6 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold">Fast Fresh Delivery</h3>
              <p className="mt-3 text-orange-100 max-w-xs text-sm leading-relaxed">
                Track your active delivery driver live as they bring your hot food right to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BECOME A PARTNER / PROMOTION SECTION */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-[40px] p-8 sm:p-12 lg:p-20 border border-orange-100/50 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 bg-radial-gradient from-orange-600 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
              {/* Text info */}
              <div className="lg:col-span-7 text-left">
                <span className="font-extrabold text-xs uppercase tracking-widest bg-orange-100 text-orange-700 px-3 py-1.5 rounded-md">
                  Grow Your Business
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-6 leading-tight">
                  Partner With Us & <br />
                  Boost Your Kitchen Sales
                </h2>
                <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                  Join BiteSwift to deliver your signature dishes to hungry locals. We handle logistics, billing, and promotions, so you can focus on cooking greatness.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                    <span className="font-bold text-gray-700">Get 30% average revenue boost</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                    <span className="font-bold text-gray-700">Dedicated delivery network</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                    <span className="font-bold text-gray-700">Interactive admin dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                    <span className="font-bold text-gray-700">24/7 technical live support</span>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <button 
                    onClick={() => alert('Registering restaurant...')}
                    className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Register Kitchen
                  </button>
                  <button 
                    onClick={() => alert('Applying to be a courier...')}
                    className="px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-2xl shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Apply as Rider
                  </button>
                </div>
              </div>

              {/* Graphic/Promo illustration */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-orange-400 to-amber-400 rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col justify-end text-white">
                  {/* Floating delivery driver mockup */}
                  <img 
                    src="https://images.unsplash.com/photo-1526367790999-015078648c7e?auto=format&fit=crop&w=600&q=80" 
                    alt="Delivery partner rider" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  
                  <div className="relative z-10 text-left">
                    <p className="font-bold text-xs uppercase tracking-widest text-orange-300">Success Story</p>
                    <h3 className="text-xl font-extrabold mt-1">"BiteSwift doubled my bakery orders in 2 months!"</h3>
                    <p className="text-xs text-gray-300 mt-2">— Sarah, Owner of Sweet Garden Bakery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 bg-[#faf9f6] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-lg max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="text-left md:max-w-md">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
                Join the Foodie Club
              </h2>
              <p className="mt-2 text-gray-500 text-sm">
                Get monthly recipes, exclusive local discount vouchers, and priority access to seasonal gourmet collections.
              </p>
            </div>

            <div className="w-full md:max-w-md">
              {newsletterSubscribed ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <span>Welcome! Check your email inbox for a 15% discount.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input 
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address" 
                    className="flex-1 px-5 py-4 bg-[#faf9f6] border border-gray-100 focus:border-orange-500 text-gray-800 placeholder-gray-400 focus:outline-none font-medium rounded-2xl"
                    required
                  />
                  <button 
                    type="submit"
                    className="px-6 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
            {/* Brand column */}
            <div className="lg:col-span-4 text-left">
              <div className="flex items-center gap-2 cursor-pointer mb-6">
                <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-2.5 rounded-2xl">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  BiteSwift
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                Deliciousness delivered directly to you. Connecting local gourmet cooking, restaurants, and active couriers to satisfy your hunger cravings.
              </p>
              {/* Social icons */}
              <div className="flex gap-4 mt-6">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <button 
                    key={social}
                    className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-orange-600 hover:text-white text-gray-400 flex items-center justify-center capitalize font-bold text-xs transition-colors"
                  >
                    {social[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="lg:col-span-2 text-left">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Explore</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li><a href="#menu" className="hover:text-white transition-colors">Our Menu</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Special Offers</a></li>
                <li><a href="#menu" className="hover:text-white transition-colors">Popular Kitchens</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Join Us</a></li>
              </ul>
            </div>

            {/* Support links */}
            <div className="lg:col-span-2 text-left">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Support</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li><button onClick={() => alert('Opening Help Center...')} className="hover:text-white text-left transition-colors">Help Center</button></li>
                <li><button onClick={() => alert('Opening Safety Hub...')} className="hover:text-white text-left transition-colors">Safety Hub</button></li>
                <li><button onClick={() => alert('Contacting Customer Care...')} className="hover:text-white text-left transition-colors">Contact Support</button></li>
                <li><button onClick={() => alert('Opening Terms of Service...')} className="hover:text-white text-left transition-colors">Terms & Policies</button></li>
              </ul>
            </div>

            {/* Contact info */}
            <div className="lg:col-span-4 text-left">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Contact</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>100 Gourmet Plaza, Food District, NY 10001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>support@biteswift.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>Mon - Sun: 7:00 AM - 12:00 AM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-xs flex flex-col sm:flex-row justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} BiteSwift Inc. All rights reserved.</p>
            <div className="flex justify-center gap-6">
              <button onClick={() => alert('Privacy Policy')} className="hover:underline">Privacy Policy</button>
              <button onClick={() => alert('Terms of Service')} className="hover:underline">Terms of Service</button>
              <button onClick={() => alert('Cookie Settings')} className="hover:underline">Cookie Settings</button>
            </div>
          </div>
        </div>
      </footer>

      {/* LOGIN & SIGNUP DIALOG MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fadeIn" 
          />

          {/* Modal box */}
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative z-10 shadow-2xl border border-gray-100 animate-scaleUp text-left">
            {/* Close button */}
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Heading */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-extrabold text-gray-900 font-serif">
                {authMode === 'login' ? 'Welcome Back' : 'Join BiteSwift'}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {authMode === 'login' ? 'Login to enjoy your favorite food' : 'Create an account to track orders and save points'}
              </p>
            </div>

            {/* Forms */}
            <form onSubmit={(e) => { e.preventDefault(); alert(`${authMode === 'login' ? 'Log in' : 'Sign up'} success!`); setIsLoginModalOpen(false); }} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Full Name</label>
                  <div className="flex items-center gap-2 bg-[#faf9f6] border border-gray-100 focus-within:border-orange-500 rounded-2xl px-4 py-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Jane Doe" 
                      className="bg-transparent border-none outline-none flex-1 text-sm text-gray-800"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Email Address</label>
                <div className="flex items-center gap-2 bg-[#faf9f6] border border-gray-100 focus-within:border-orange-500 rounded-2xl px-4 py-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="email@example.com" 
                    className="bg-transparent border-none outline-none flex-1 text-sm text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Password</label>
                  {authMode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => alert('Reset password link sent')}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-[#faf9f6] border border-gray-100 focus-within:border-orange-500 rounded-2xl px-4 py-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-transparent border-none outline-none flex-1 text-sm text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                className="w-full py-4 mt-6 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-200"
              >
                {authMode === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            </form>

            {/* Alternative auth mode trigger */}
            <div className="mt-6 text-center text-sm font-semibold text-gray-500">
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setAuthMode('signup')}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setAuthMode('login')}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Log In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
