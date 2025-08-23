import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signIn, signUp, signInDemo } = useAuth();

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setErrors({ general: error.message });
        } else {
          onClose();
          resetForm();
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          setErrors({ general: error.message });
        } else {
          setErrors({ general: 'Check your email for the confirmation link!' });
          setMode('login');
          resetForm();
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('Demo login button clicked');
      const { error } = await signInDemo();
      if (error) {
        setErrors({ general: 'Demo login failed' });
        console.error('Demo login error:', error);
      } else {
        console.log('Demo login successful, closing modal');
        // Close modal immediately after successful demo login
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Demo login exception:', error);
      setErrors({ general: 'Demo login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full border-2 border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {mode === 'login' ? (
              <LogIn className="w-6 h-6 text-blue-400" />
            ) : (
              <UserPlus className="w-6 h-6 text-green-400" />
            )}
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-400">
              {mode === 'login' 
                ? 'Sign in to access your Pokemon card collection' 
                : 'Join the community and start building your collection'
              }
            </p>
          </div>

          {/* Demo Login Button */}
          {mode === 'login' && (
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <User className="w-4 h-4" />
              )}
              Try Demo Account
            </button>
          )}

          {/* Divider */}
          {mode === 'login' && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or continue with email</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className={`mb-4 p-3 rounded-lg ${
              errors.general.includes('Check your email') 
                ? 'bg-green-900/50 border border-green-700' 
                : 'bg-red-900/50 border border-red-700'
            }`}>
              <p className={`text-sm ${
                errors.general.includes('Check your email') 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {errors.general}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3 ${
                mode === 'login' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } disabled:opacity-50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? (
                    <LogIn className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                disabled={isLoading}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;