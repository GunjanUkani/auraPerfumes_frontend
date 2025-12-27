// pages/Settings.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Bell, Lock, Globe, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    newArrivals: true,
    language: 'en',
    timezone: 'EST',
    twoFactorAuth: false
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleSaveSettings = () => {
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (password.new !== password.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (password.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setPassword({ current: '', new: '', confirm: '' });
      toast.success('Password changed successfully');
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8 flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-3xl font-serif font-light tracking-wide">
              Account Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account preferences and security
            </p>
          </div>
          <motion.button
            onClick={() => navigate('/profile')}
            className="text-gray-700 hover:text-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Profile
          </motion.button>
        </motion.div>

        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Notification Settings */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-6">
              <Bell className="text-gray-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries({
                emailNotifications: 'Email Notifications',
                marketingEmails: 'Marketing Emails',
                orderUpdates: 'Order Updates',
                newArrivals: 'New Arrivals'
              }).map(([key, label], index) => (
                <motion.div 
                  key={key} 
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-gray-600">
                      {key === 'emailNotifications' && 'Receive important account notifications'}
                      {key === 'marketingEmails' && 'Promotions, discounts, and special offers'}
                      {key === 'orderUpdates' && 'Shipping updates and delivery notifications'}
                      {key === 'newArrivals' && 'Get notified about new perfume launches'}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof settings] }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings[key as keyof typeof settings] ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        settings[key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-6">
              <Lock className="text-gray-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  {['Current Password', 'New Password', 'Confirm New Password'].map((label, index) => {
                    const getInputType = () => {
                      if (label === 'Current Password') {
                        return showCurrent ? 'text' : 'password';
                      }
                      if (label === 'New Password') {
                        return showNew ? 'text' : 'password';
                      }
                      return showConfirm ? 'text' : 'password';
                    };

                    const getInputValue = () => {
                      if (label === 'Current Password') return password.current;
                      if (label === 'New Password') return password.new;
                      return password.confirm;
                    };

                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      if (label === 'Current Password') {
                        setPassword(prev => ({ ...prev, current: value }));
                      } else if (label === 'New Password') {
                        setPassword(prev => ({ ...prev, new: value }));
                      } else {
                        setPassword(prev => ({ ...prev, confirm: value }));
                      }
                    };

                    const toggleVisibility = () => {
                      if (label === 'Current Password') setShowCurrent(!showCurrent);
                      else if (label === 'New Password') setShowNew(!showNew);
                      else setShowConfirm(!showConfirm);
                    };

                    const getEyeIcon = () => {
                      const isVisible = label === 'Current Password' ? showCurrent : 
                                      label === 'New Password' ? showNew : showConfirm;
                      return isVisible ? <EyeOff size={20} /> : <Eye size={20} />;
                    };

                    return (
                      <motion.div
                        key={label}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + (index * 0.05) }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {label}
                        </label>
                        <div className="relative">
                          <input
                            type={getInputType()}
                            value={getInputValue()}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                          <motion.button
                            type="button"
                            onClick={toggleVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {getEyeIcon()}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  <motion.button
                    onClick={handlePasswordChange}
                    disabled={!password.current || !password.new || !password.confirm || updatingPassword}
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </motion.button>
                </div>
              </div>
              
              <motion.div 
                className="pt-6 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium mr-3 ${settings.twoFactorAuth ? 'text-green-600' : 'text-gray-600'}`}>
                      {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </span>
                    <motion.button
                      onClick={() => setSettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.twoFactorAuth ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                          settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                </div>
                {settings.twoFactorAuth && (
                  <motion.div 
                    className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center">
                      <Check className="text-green-600 mr-2" size={18} />
                      <p className="text-sm text-green-800">
                        Two-factor authentication is now enabled for your account.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-6">
              <Globe className="text-gray-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { 
                  key: 'language', 
                  label: 'Language', 
                  value: settings.language, 
                  options: [
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Español' },
                    { value: 'fr', label: 'Français' },
                    { value: 'de', label: 'Deutsch' }
                  ] 
                },
                { 
                  key: 'timezone', 
                  label: 'Timezone', 
                  value: settings.timezone, 
                  options: [
                    { value: 'EST', label: 'Eastern Time (EST)' },
                    { value: 'CST', label: 'Central Time (CST)' },
                    { value: 'MST', label: 'Mountain Time (MST)' },
                    { value: 'PST', label: 'Pacific Time (PST)' }
                  ] 
                }
              ].map((pref, index) => (
                <motion.div
                  key={pref.key}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + (index * 0.05) }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {pref.label}
                  </label>
                  <motion.select
                    value={pref.value}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      [pref.key]: e.target.value 
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    whileFocus={{ scale: 1.02 }}
                  >
                    {pref.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </motion.select>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div 
            className="flex justify-end"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Save size={20} className="mr-2" />
              {savingSettings ? 'Saving...' : 'Save All Changes'}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;