
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Make sure the path is correct
import { BASE_URL } from '../config/api.config';
import { Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  // const location = useLocation();
  const { login } = useAuth();

  // Get the return URL from location state or default to dashboard
  // const from = location.state?.from?.pathname || "/user-dashboard";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (loginData) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store the token and user info in auth context
        const userData = {
          ...data.user,
          token: data.token || 'dummy-token',
          type: data.user_type
        };
        
        login(userData);
        
        // Log the user's email for debugging
        console.log('Logged-in User Email:', userData.email);
        
        setMessage(data.message || 'Login successful');
        setIsSuccess(true);

        // Small delay to show success message
        setTimeout(() => {
          navigate(data.redirect || '/user-dashboard', { replace: true });
        }, 500);

        return true;
      } else {
        // Handle login failure
        setMessage(data.message || 'Login failed');
        setIsSuccess(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred during login');
      setIsSuccess(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleLogin(formData);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const inputStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-600">Sign in to continue your journey</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 animate-scale">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className={inputStyles}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`${inputStyles} pr-10`}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#D54B06] transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-[#D54B06] hover:bg-[#B54000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D54B06] transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            {message && (
              <div className={`mt-4 p-3 rounded-md ${
                isSuccess 
                  ? 'bg-green-200 border border-green-400' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-center text-sm ${
                  isSuccess ? 'text-green-900' : 'text-red-600'
                }`}>
                  {message}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600">
                <Link to="/forgot-password" className="text-[#D54B06] hover:text-[#B54000] transition-colors duration-200">
                  Forgot password?
                </Link>
              </p>
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#D54B06] hover:text-[#B54000] transition-colors duration-200">
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;