import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit, Save, X, Calendar, MapPin, Lock, Package, Heart, Award, Truck, Gift, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    loyaltyPoints: 0,
    deliveredOrders: 0,
    recentActivity: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('perfume_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setEditedUser(userData);
      
      // Load user-specific stats
      loadUserStats(userData);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadUserStats = (userData: any) => {
    // Get user-specific orders from localStorage
    const userOrders = JSON.parse(localStorage.getItem(`orders_${userData.email}`) || '[]');
    
    // Get user wishlist
    const userWishlist = JSON.parse(localStorage.getItem(`wishlist_${userData.email}`) || '[]');
    
    // Calculate stats
    const totalOrders = userOrders.length;
    const deliveredOrders = userOrders.filter((order: any) => order.status === 'delivered').length;
    const wishlistItems = userWishlist.length;
    
    // Generate loyalty points based on activity
    const loyaltyPoints = totalOrders * 100 + deliveredOrders * 50 + wishlistItems * 10;
    
    // Generate recent activity from orders
    const recentActivity = userOrders.slice(0, 4).map((order: any) => ({
      action: order.status === 'delivered' ? 'Order Delivered' : 
              order.status === 'shipped' ? 'Order Shipped' :
              order.status === 'processing' ? 'Order Processing' :
              'Order Placed',
      time: order.date || 'Recently',
      status: order.status === 'delivered' ? 'Delivered' :
              order.status === 'cancelled' ? 'Cancelled' :
              'In Progress',
      orderId: order.id
    }));

    setUserStats({
      totalOrders,
      wishlistItems,
      loyaltyPoints,
      deliveredOrders,
      recentActivity
    });
  };

  const editViewAnimation = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: {
      stiffness: 100,
      damping: 15
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(user);
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPassword({
      current: false,
      new: false,
      confirm: false
    });
  };

  const handleSaveChanges = () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedUser.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate phone (optional, but if provided, validate)
    if (editedUser.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(editedUser.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Save to localStorage
    localStorage.setItem('perfume_user', JSON.stringify(editedUser));
    setUser(editedUser);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
    setShowPassword({
      current: false,
      new: false,
      confirm: false
    });
    toast.success('Password changed successfully');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('perfume_user');
    localStorage.removeItem('rememberMe');
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const slideInVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1
    }
  };

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-600"
          >
            Loading profile...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Stats data based on user activity
  const statsData = [
    { 
      icon: Package, 
      label: "Orders", 
      value: userStats.totalOrders.toString(), 
      color: "from-blue-500 to-blue-600",
      onClick: () => navigate('/orders')
    },
    { 
      icon: Heart, 
      label: "Wishlist", 
      value: userStats.wishlistItems.toString(), 
      color: "from-pink-500 to-pink-600",
      onClick: () => navigate('/wishlist')
    },
    { 
      icon: Award, 
      label: "Rewards", 
      value: userStats.loyaltyPoints.toLocaleString(), 
      color: "from-amber-500 to-amber-600",
      onClick: () => toast.info(`${userStats.loyaltyPoints} loyalty points earned!`)
    },
    { 
      icon: Truck, 
      label: "Delivered", 
      value: userStats.deliveredOrders.toString(), 
      color: "from-green-500 to-green-600",
      onClick: () => navigate('/orders?status=delivered')
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="text-green-500" size={16} />;
      case 'cancelled': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-yellow-500" size={16} />;
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-serif font-light tracking-wide"
          >
            Welcome, {isEditing ? editedUser.firstName : user.firstName}!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mt-2"
          >
            Member since {user.joinDate || 'January 2024'}
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <motion.h2 
                  initial="hidden"
                  animate="visible"
                  variants={slideInVariants}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-xl font-semibold text-gray-800"
                >
                  Personal Information
                </motion.h2>
                {!isEditing ? (
                  <motion.button
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={handleEditClick}
                    className="flex items-center text-gray-700 hover:text-gray-900 transition"
                  >
                    <Edit size={18} className="mr-2" />
                    <span className="text-sm">Edit</span>
                  </motion.button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex space-x-3"
                  >
                    <motion.button
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      onClick={handleCancelEdit}
                      className="flex items-center text-gray-700 hover:text-gray-900 transition"
                    >
                      <X size={18} className="mr-2" />
                      <span className="text-sm">Cancel</span>
                    </motion.button>
                    <motion.button
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      onClick={handleSaveChanges}
                      className="flex items-center bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-gray-600 transition shadow-md"
                    >
                      <Save size={18} className="mr-2" />
                      <span className="text-sm">Save</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                    <User size={48} className="text-gray-500" />
                  </div>
                  {isEditing && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="absolute bottom-0 right-0 bg-gradient-to-r from-gray-900 to-gray-700 text-white p-2 rounded-full hover:from-gray-800 hover:to-gray-600 transition shadow-lg"
                    >
                      <Edit size={16} />
                    </motion.button>
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        key="edit-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={editedUser.firstName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                          </motion.div>
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={editedUser.lastName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="display-info"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-2xl font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Member since {user.joinDate || 'January 2024'}
                        </p>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center mt-4 space-x-4"
                        >
                          <motion.span 
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full shadow-sm"
                          >
                            Premium Member
                          </motion.span>
                          <motion.span 
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-xs px-3 py-1 rounded-full shadow-sm"
                          >
                            Verified
                          </motion.span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
              >                
                {/* Contact Information */}
                <motion.div variants={itemVariants}>
                  <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Email */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <Mail size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Email Address</p>

                        <AnimatePresence mode="wait">
                          {isEditing ? (
                            <motion.div key="email-edit" {...editViewAnimation}>
                              <input
                                type="email"
                                name="email"
                                value={editedUser.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 transition"
                              />
                            </motion.div>
                          ) : (
                            <motion.div key="email-view" {...editViewAnimation}>
                              <p className="font-medium text-gray-900">{user.email}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    </motion.div>

                    {/* Phone */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <Phone size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Phone Number</p>

                        <AnimatePresence mode="wait">
                          {isEditing ? (
                            <motion.div key="phone-edit" {...editViewAnimation}>
                              <input
                                type="tel"
                                name="phone"
                                value={editedUser.phone || ""}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 transition"
                              />
                            </motion.div>
                          ) : (
                            <motion.div key="phone-view" {...editViewAnimation}>
                              <p className="font-medium text-gray-900">
                                {user.phone || "Not provided"}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    </motion.div>

                  </div>
                </motion.div>


                {/* Additional Information */}
                <motion.div variants={itemVariants}>
                  <h3 className="font-medium text-gray-900 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <Calendar size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                        {isEditing ? (
                          <input
                            type="date"
                            name="dob"
                            value={editedUser.dob || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                          />
                        ) : (
                          <p className="font-medium text-gray-900">
                            {user.dob || 'Not specified'}
                          </p>
                        )}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <MapPin size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Location</p>
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={editedUser.location || ''}
                            onChange={handleInputChange}
                            placeholder="City, Country"
                            className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                          />
                        ) : (
                          <p className="font-medium text-gray-900">
                            {user.location || 'Not specified'}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Password Change Section */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-6 border-t border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Password</h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          onClick={() => setIsChangingPassword(!isChangingPassword)}
                          className="text-sm text-gray-700 hover:text-gray-900"
                        >
                          {isChangingPassword ? 'Cancel' : 'Change Password'}
                        </motion.button>
                      </div>
                      
                      <AnimatePresence>
                        {isChangingPassword && (
                          <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword.current ? "text" : "password"}
                                  value={passwordData.currentPassword}
                                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                                  placeholder="Enter current password"
                                />
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility('current')}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                  {showPassword.current ? "Hide" : "Show"}
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  New Password
                                </label>
                                <div className="relative">
                                  <input
                                    type={showPassword.new ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                                    placeholder="Enter new password"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                  >
                                    {showPassword.new ? "Hide" : "Show"}
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Confirm New Password
                                </label>
                                <div className="relative">
                                  <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                                    placeholder="Confirm new password"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                  >
                                    {showPassword.confirm ? "Hide" : "Show"}
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <motion.button
                              initial="initial"
                              whileHover="hover"
                              whileTap="tap"
                              variants={buttonVariants}
                              onClick={handlePasswordChange}
                              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition shadow-md"
                            >
                              Update Password
                            </motion.button>
                            
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="text-xs text-gray-500 mt-2"
                            >
                              Password must be at least 6 characters long
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {!isChangingPassword && (
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm border border-gray-100"
                        >
                          <Lock size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Password</p>
                            <p className="font-medium text-gray-900">••••••••</p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
            
            {/* Dynamic Stats Cards */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-4 shadow-lg cursor-pointer`}
                  onClick={stat.onClick}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm opacity-90">{stat.label}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                    >
                      <stat.icon size={24} className="opacity-80" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Recent Activity */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                <button 
                  onClick={() => navigate('/orders')}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  View All
                </button>
              </div>
              
              {userStats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {userStats.recentActivity.map((activity: any, index) => (
                    <motion.div
                      key={activity.orderId || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-sm transition"
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                      </div>
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`text-sm px-3 py-1 rounded-full ${
                          activity.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          activity.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {activity.status}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No activity yet</h3>
                  <p className="mt-2 text-gray-500">
                    Start shopping to see your recent activity here
                  </p>
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    onClick={() => navigate('/products')}
                    className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Browse Products
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Account Summary */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4">Account Summary</h3>
              <div className="space-y-3">
                {[
                  { label: "Member Since", value: user.joinDate || 'Jan 2024' },
                  { label: "Account Type", value: "Premium", color: "text-purple-600" },
                  { label: "Verified Status", value: "Verified", color: "text-green-600" },
                  { label: "Loyalty Points", value: userStats.loyaltyPoints.toLocaleString(), color: "text-amber-600" }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className={`font-medium ${item.color || 'text-gray-900'}`}>
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: "View Order History", path: "/orders" },
                  { label: "Account Settings", path: "/settings" },
                  { label: "Payment Methods", path: "/payment-methods" },
                  { label: "Notification Preferences", path: "/notifications" }
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.path)}
                    className="block w-full text-left text-sm text-gray-700 hover:text-gray-900 py-2 hover:bg-gray-50 rounded-lg px-3 transition"
                  >
                    {action.label}
                  </motion.button>
                ))}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={handleLogout}
                  className="block w-full text-left text-sm bg-gradient-to-r from-red-600 to-red-500 text-white py-2 hover:from-red-700 hover:to-red-600 rounded-lg px-3 transition shadow-md mt-4"
                >
                  Sign Out
                </motion.button>
              </div>
            </motion.div>

            {/* Security Tips */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6"
            >
              <motion.div
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <Gift className="text-blue-600 mb-3" size={24} />
              </motion.div>
              <h3 className="font-semibold text-blue-900 mb-2">Security Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                {[
                  "Use a strong, unique password",
                  "Enable two-factor authentication",
                  "Never share your login details",
                  "Regularly update your password"
                ].map((tip, index) => (
                  <motion.li
                    key={tip}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    className="flex items-start"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: index * 0.5 }}
                      className="mr-2 text-blue-600"
                    >
                      •
                    </motion.span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;