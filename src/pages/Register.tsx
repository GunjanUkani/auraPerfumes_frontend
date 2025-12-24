import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, Check, Facebook, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialRegister, setSocialRegister] = useState({
    facebook: false,
    twitter: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialRegister = (platform: 'facebook' | 'twitter') => {
    setSocialRegister(prev => ({
      facebook: platform === 'facebook',
      twitter: platform === 'twitter'
    }));

    toast.success(`Registering with ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`);
    // Add your social registration logic here
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    // Check if user already exists
    const existingUsers = getAllUsers();
    const userExists = existingUsers.some((user: any) =>
      user.email.toLowerCase() === formData.email.toLowerCase() ||
      user.username.toLowerCase() === formData.username.toLowerCase()
    );

    if (userExists) {
      toast.error('User with this email or username already exists');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create user object with password
      const userData = {
        id: Date.now().toString(),
        firstName: formData.username.split(' ')[0] || formData.username,
        lastName: formData.username.split(' ')[1] || '',
        email: formData.email,
        username: formData.username,
        password: formData.password, // Store password (in real app, hash it)
        phone: formData.phone,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };

      // Add to users array
      const updatedUsers = [...existingUsers, userData];
      localStorage.setItem('perfume_users', JSON.stringify(updatedUsers));

      // Set as current user
      localStorage.setItem('perfume_user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');

      toast.success('Registration successful! Welcome to PERFUME.');

      // Navigate to profile
      navigate('/profile', { replace: true });

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this helper function at top of component
  const getAllUsers = () => {
    try {
      const usersData = localStorage.getItem('perfume_users');
      if (usersData) {
        return JSON.parse(usersData);
      }
      return [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthText = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CREATE ACCOUNT</h1>
          <p className="text-gray-600">Join our exclusive fragrance community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Registration Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Register Now</h2>

            {/* Social Register */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">Register with social account</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSocialRegister('facebook')}
                  className={`flex items-center justify-center w-full py-3 rounded-lg border transition-all duration-300 ${socialRegister.facebook
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  <Facebook size={20} className="mr-2" />
                  <span className="font-medium">FACEBOOK</span>
                  <div className={`ml-2 w-5 h-5 rounded border flex items-center justify-center ${socialRegister.facebook ? 'bg-white border-white' : 'border-gray-400'
                    }`}>
                    {socialRegister.facebook && <Check size={12} className="text-blue-600" />}
                  </div>
                </button>

                <button
                  onClick={() => handleSocialRegister('twitter')}
                  className={`flex items-center justify-center w-full py-3 rounded-lg border transition-all duration-300 ${socialRegister.twitter
                      ? 'bg-blue-400 text-white border-blue-400'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  <Twitter size={20} className="mr-2" />
                  <span className="font-medium">TWITTER</span>
                  <div className={`ml-2 w-5 h-5 rounded border flex items-center justify-center ${socialRegister.twitter ? 'bg-white border-white' : 'border-gray-400'
                    }`}>
                    {socialRegister.twitter && <Check size={12} className="text-blue-400" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition text-base bg-gray-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition text-base bg-gray-50"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition text-base bg-gray-50"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition text-base bg-gray-50"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className={`text-xs font-medium ${strength === 4 ? 'text-green-600' :
                          strength === 3 ? 'text-yellow-600' :
                            strength === 2 ? 'text-orange-600' :
                              'text-red-600'
                        }`}>
                        {strengthText[strength - 1] || 'None'}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${index < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                            }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition text-base bg-gray-50"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start pt-4">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`flex items-center justify-center w-6 h-6 rounded border mt-0.5 ${agreedToTerms ? 'bg-gray-900 border-gray-900' : 'border-gray-400'
                    }`}
                >
                  {agreedToTerms && <Check size={14} className="text-white" />}
                </button>
                <div className="ml-3">
                  <label className="text-sm text-gray-700">
                    I agree to{' '}
                    <Link to="/terms" className="text-gray-900 hover:text-black font-medium underline">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-gray-900 hover:text-black font-medium underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    CREATING ACCOUNT...
                  </div>
                ) : (
                  'REGISTER NOW'
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-gray-900 hover:text-black underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Right Column - Benefits */}
          <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6">Membership Benefits</h3>

            <div className="space-y-5">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Check size={16} className="text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Exclusive Discounts</h4>
                  <p className="text-sm text-gray-300 mt-1">Get member-only pricing on all collections</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Check size={16} className="text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Early Access</h4>
                  <p className="text-sm text-gray-300 mt-1">Be the first to experience new fragrances</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Check size={16} className="text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-sm text-gray-300 mt-1">Enjoy free shipping on all orders</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Check size={16} className="text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Personalized Recommendations</h4>
                  <p className="text-sm text-gray-300 mt-1">Get tailored fragrance suggestions</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Check size={16} className="text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Birthday Surprise</h4>
                  <p className="text-sm text-gray-300 mt-1">Special gift on your birthday</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <h4 className="font-semibold mb-3">Account Security</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-300">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-300">Secure payment processing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-300">Privacy protected data</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/10 rounded-xl">
              <p className="text-sm text-center text-gray-300">
                Join <span className="font-semibold text-white">5,000+</span> fragrance enthusiasts
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By registering, you agree to PERFUME's{' '}
            <Link to="/terms" className="text-gray-900 hover:text-black font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-gray-900 hover:text-black font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;