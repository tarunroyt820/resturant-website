import React from 'react';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const { id, name, category, image, rating, reviewsCount, deliveryTime, priceLevel, deliveryFee } = restaurant;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group text-left">
      {/* Image with Tag */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-600 shadow-sm">
          {category}
        </div>
      </div>

      {/* Details Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-extrabold text-gray-900">{rating || '4.5'}</span>
          </div>
        </div>

        {/* Technical stats */}
        <div className="flex items-center gap-4 mt-3 py-3 border-y border-gray-50 text-gray-500 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>{deliveryTime || '20-30 min'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Price: {priceLevel || '$$'}</span>
          </div>
          <div className="ml-auto text-orange-600 font-extrabold">
            <span>{deliveryFee === 'Free' || deliveryFee === 0 ? 'Free Delivery' : `Fee: $${deliveryFee}`}</span>
          </div>
        </div>

        {/* View Menu CTA Button */}
        <button 
          onClick={() => navigate(`/menu/${id}`)}
          className="mt-6 w-full py-3.5 bg-[#faf9f6] group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-amber-500 text-gray-700 group-hover:text-white font-bold rounded-2xl flex items-center justify-center gap-2 border border-gray-100 group-hover:border-transparent transition-all duration-300"
        >
          <span>View Menu</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
