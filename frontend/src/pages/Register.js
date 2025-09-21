import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function normalizeTHPhone(raw) {
  if (!raw) return '';
  let p = String(raw).replace(/[\s-]/g, '');
  if (/^0\d{9}$/.test(p)) return '+66' + p.slice(1);
  if (/^\+66\d{9}$/.test(p)) return p;
  return p;
}

function isValidTHPhoneE164(p) {
  return /^\+66\d{9}$/.test(p);
}

export default function Register() {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else {
      const normalized = normalizeTHPhone(formData.phone);
      if (!isValidTHPhoneE164(normalized)) {
        newErrors.phone = 'Phone number is invalid (use 0XXXXXXXXX or +66XXXXXXXXX)';
      }
    }
    if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const full_name = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const phoneE164 = normalizeTHPhone(formData.phone);
      await api.register({
        full_name,
        email: formData.email,
        phone: phoneE164,
        password: formData.password
      });
      nav('/login');
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please try again.';
      setErrors(prev => ({ ...prev, general: msg }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 text-white">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Join ParcelFlow</h1>
          <p className="text-gray-300">Create your account and start managing parcels</p>
        </div>

        {/* Register Form */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-xl border border-yellow-500/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="bg-red-900/50 border border-red-500 rounded-xl p-4 text-red-300 text-sm">
                {errors.general}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-yellow-400 mb-2">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl bg-black border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-yellow-400 mb-2">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl bg-black border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl bg-black border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl bg-black border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="0812345678 หรือ +66812345678"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl bg-black border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl bg-black border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="••••••••"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-yellow-400 border-gray-700 bg-black rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-yellow-400 hover:underline">Terms and Conditions</Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-semibold bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg transition"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 hover:underline">Sign in here</Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2024 ParcelFlow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
