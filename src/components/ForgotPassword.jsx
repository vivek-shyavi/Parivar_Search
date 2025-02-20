import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config/api.config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setMessage('Password reset instructions have been sent to your email.');
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Failed to process request');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsSuccess(false);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
        <p className="text-center text-gray-600">Enter your email to reset your password</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={inputStyles}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-[#D54B06] hover:bg-[#B54000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D54B06] transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Reset Password'}
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

            <div className="text-center">
              <Link
                to="/signin"
                className="text-sm text-[#D54B06] hover:text-[#B54000] transition-colors duration-200"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;