
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/api.config';

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [nameWarnings, setNameWarnings] = useState({
    first_name: false,
    last_name: false
  });

  const validateName = (value) => {
    return /^[a-zA-Z]*$/.test(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Show warning if name fields contain non-letters
    if (name === 'first_name' || name === 'last_name') {
      setNameWarnings(prev => ({
        ...prev,
        [name]: value && !validateName(value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate names before submission
    if (!validateName(formData.first_name) || !validateName(formData.last_name)) {
      setMessage('Please use only letters for first and last names.');
      setMessageType('error');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/signup`, formData);
      setMessage(response.data.message);
      setMessageType('success');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const MessageContainer = ({ type, message }) => {
    const baseClasses = "mt-4 p-4 rounded-md text-sm font-medium text-center";
    const typeClasses = {
      success: "bg-green-50 text-green-800 border border-green-200",
      error: "bg-red-50 text-red-800 border border-red-200"
    };

    return message ? (
      <div className={`${baseClasses} ${typeClasses[type]} animate-fade-in`}>
        {message}
      </div>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">Join ParivarSearch</h2>
        <p className="text-center text-gray-600">Start your family history journey today</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 animate-scale">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  {nameWarnings.first_name && (
                    <div className="absolute -bottom-6 left-0 bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded text-xs font-medium flex items-center">
                      <span className="mr-1">!</span>
                      Only letters are allowed
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                  {nameWarnings.last_name && (
                    <div className="absolute -bottom-6 left-0 bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded text-xs font-medium flex items-center">
                      <span className="mr-1"></span>
                      ! Only letters are allowed
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div> */}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email 
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D54B06] hover:bg-[#B54000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D54B06] transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            <MessageContainer type={messageType} message={message} />

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#D54B06] hover:text-[#B54000] transition-colors duration-300">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;