import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Package, Heart, Award, Truck, Gift, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Local storage से user data लें
    const savedUser = localStorage.getItem('perfume_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // अगर user नहीं है, तो login page पर redirect करें
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
  localStorage.removeItem('perfume_user');
  localStorage.removeItem('rememberMe'); // Remember me भी clear करो
  toast.success('Logged out successfully');
  
  navigate('/', { replace: true });
  
  setTimeout(() => {
    window.location.reload();
  }, 100);
};

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-light tracking-wide">
            Welcome, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Member since {user.joinDate || 'January 2024'}
          </p>
        </div>
        
        {/* Rest of your existing Profile component */}
        {/* Just replace {user?.firstName} etc with {user.firstName} */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                <button className="flex items-center text-gray-700 hover:text-gray-900 transition">
                  <Edit size={18} className="mr-2" />
                  <span className="text-sm">Edit</span>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Member since {user.joinDate || 'January 2024'}
                  </p>
                  <div className="flex items-center mt-4 space-x-4">
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      Premium Member
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Phone size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                    <p className="font-medium text-gray-900">
                      {user.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ... Rest of your profile component remains same ... */}
            
          </div>
          
          {/* Quick Actions में Logout Button Add करें */}
          <div className="space-y-8">
            {/* ... Other sidebar components ... */}
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/orders" className="block text-sm text-gray-700 hover:text-gray-900 py-2">
                  View Order History
                </a>
                <a href="/settings" className="block text-sm text-gray-700 hover:text-gray-900 py-2">
                  Account Settings
                </a>
                <a href="/payment-methods" className="block text-sm text-gray-700 hover:text-gray-900 py-2">
                  Payment Methods
                </a>
                <a href="/notifications" className="block text-sm text-gray-700 hover:text-gray-900 py-2">
                  Notification Preferences
                </a>
                <button 
                  onClick={handleLogout}
                  className="block text-sm text-red-600 hover:text-red-700 py-2 text-left w-full"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;