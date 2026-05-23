import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Shield, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // State variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' or 'restaurant'
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Email format validator
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form validations
    if (!name.trim()) return setError('Full Name is required.');
    if (!email.trim()) return setError('Email address is required.');
    if (!validateEmail(email)) return setError('Please enter a valid email format.');
    if (password.length < 6) return setError('Password must be at least 6 characters long.');
    if (!role) return setError('Please select a user role.');

    setLoading(true);

    try {
      await register(name, email, password, role);
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Clear forms
      setName('');
      setEmail('');
      setPassword('');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl -z-10" />

      {/* Back button */}
      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-gray-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 cursor-pointer mb-6">
          <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            BiteSwift
          </span>
        </div>
        <h2 className="text-center font-serif text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Or{' '}
          <Link to="/login" className="font-bold text-orange-600 hover:underline">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/80 border border-gray-100 sm:rounded-[32px] sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-bold animate-fadeIn">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm font-bold animate-fadeIn">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                Full Name
              </label>
              <div className="flex items-center gap-2 bg-[#faf9f6] border border-gray-100 focus-within:border-orange-500 rounded-2xl px-4 py-3 transition-colors">
                <User className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="bg-transparent border-none outline-none flex-1 text-sm text-gray-800 focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                Email Address
              </label>
              <div className="flex items-center gap-2 bg-[#faf9f6] border border-gray-100 focus-within:border-orange-500 rounded-2xl px-4 py-3 transition-colors">
                <Mail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="bg-transparent border-none outline-none flex-1 text-sm text-gray-800 focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                Password
              </label>
              <div className="flex items-center gap-2 bg-[#faf9f6] border border-gray-100 focus-within:border-orange-500 rounded-2xl px-4 py-3 transition-colors">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none flex-1 text-sm text-gray-800 focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Role Select Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-sm border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    role === 'customer'
                      ? 'bg-orange-500/10 border-orange-500 text-orange-700 shadow-sm'
                      : 'bg-[#faf9f6] border-gray-100 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">🍔</span>
                  <span>Order Food</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('restaurant')}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-sm border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    role === 'restaurant'
                      ? 'bg-orange-500/10 border-orange-500 text-orange-700 shadow-sm'
                      : 'bg-[#faf9f6] border-gray-100 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">🍳</span>
                  <span>Manage Kitchen</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/35 flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
