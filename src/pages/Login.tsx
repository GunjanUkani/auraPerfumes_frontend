import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to get all registered users from localStorage
  const getAllUsers = () => {
    try {
      // Check if we have a users array in localStorage
      const usersData = localStorage.getItem('perfume_users');
      if (usersData) {
        return JSON.parse(usersData);
      }
      
      // For backward compatibility, check single user
      const singleUser = localStorage.getItem('perfume_user');
      if (singleUser) {
        return [JSON.parse(singleUser)];
      }
      
      return [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  };

  // Function to find user by email
  const findUserByEmail = (email: string) => {
    const users = getAllUsers();
    return users.find((user: any) => user.email.toLowerCase() === email.toLowerCase());
  };

  // Function to validate password
  const validatePassword = (user: any, password: string) => {
    // In real app, you should hash passwords and compare hashes
    // For demo, we'll check if password matches
    return user.password === password || user.demoPassword === password;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!loginData.email || !loginData.password) {
    toast.error('Please fill in all fields');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Save auth data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('isLoggedIn', 'true');

    // Remember me
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('rememberedEmail', loginData.email);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedEmail');
    }
    console.log("Data",data)
    toast.success(`Welcome back, ${data.data.name || 'User'}!`);

    navigate('/profile', { replace: true });

    // Optional reload to refresh auth state
    setTimeout(() => {
      window.location.reload();
    }, 100);

  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.message || 'Invalid email or password');
  } finally {
    setIsLoading(false);
  }
};


  // Load remembered email if exists
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setLoginData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">
          
          {/* Brand Logo Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-light tracking-widest">PERFUME</h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">Signature Fragrances</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
            
            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2 text-sm md:text-base">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition text-sm md:text-base"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs md:text-sm text-gray-600 hover:text-gray-800 transition"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition text-sm md:text-base"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-gray-400 hover:text-gray-600 transition" />
                    ) : (
                      <Eye size={20} className="text-gray-400 hover:text-gray-600 transition" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white font-medium py-3 md:py-3.5 rounded-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm md:text-base"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>              
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
              <p className="text-sm md:text-base text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-gray-800 hover:text-black transition"
                >
                  Sign up
                </Link>
              </p>
            </div>

          </div>
          
          {/* Debug Info (Remove in production) */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                const users = getAllUsers();
                console.log('All registered users:', users);
                toast.success(`Found ${users.length} registered users`);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Debug: Check Registered Users
            </button>
          </div>
          
          {/* Bottom Spacing */}
          <div className="h-8 md:h-12"></div>
        </div>
      </main>
    </div>
  );
};

export default Login;