import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config/api.config';

const OtpVerificationDialog = ({ onVerificationSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();

  const handleInitialClick = () => {
    setIsOpen(true);
    setStatus('initial');
  };

  const handleSendOtp = async () => {
    try {
      setStatus('sending');
      setErrorMessage('');

      const userEmail = user?.email;
      if (!userEmail) {
        throw new Error('User email not found');
      }

      const response = await fetch(`${BASE_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: userEmail })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }
      setStatus('sent');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setStatus('verifying');
      setErrorMessage('');

      // Show verifying state for at least 1 second
      const verifyStartTime = Date.now();
      
      const response = await fetch(`${BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          email: user?.email,
          otp: otp 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid OTP');
      }

      // Ensure verifying state shows for at least 1 second
      const elapsedTime = Date.now() - verifyStartTime;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
      
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('initial');
        setOtp('');
        onVerificationSuccess();
      }, 2000);
    } catch (error) {
      setStatus('invalid');
      setErrorMessage(error.message || 'Invalid OTP. Please try again.');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleInitialClick}
        className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition w-full"
      >
        Get Pandit Details
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Verify Your Identity
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {status === 'initial' && (
          <>
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <p className="text-blue-600">
                  Click below to receive an OTP on your registered email
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSendOtp}
                className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition"
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {status === 'sending' && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Sending verification code to your registered email...
            </p>
          </div>
        )}

        {(status === 'sent' || status === 'invalid') && (
          <>
            <div className="mb-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <p className="text-green-700">
                    OTP has been sent to your email address
                  </p>
                </div>
              </div>
            </div>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {status === 'invalid' && (
              <div className="mb-4">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleSendOtp}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Resend OTP
              </button>
              <button
                onClick={handleVerifyOtp}
                className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition"
              >
                Verify OTP
              </button>
            </div>
          </>
        )}

        {status === 'verifying' && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Verifying OTP...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <p className="text-green-600">
              Verification successful! Getting Pandit details...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={handleSendOtp}
              className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationDialog;