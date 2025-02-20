// import React, { useState } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { BASE_URL } from '../config/api.config';

// const ResetPassword = () => {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = new URLSearchParams(location.search).get('token');

//   const validatePassword = (password) => {
//     const trimmedPassword = password.trim();
    
//     // Check length between 8 and 13
//     if (trimmedPassword.length < 8) {
//       return 'Password must be at least 8 characters long';
//     }
//     if (trimmedPassword.length > 13) {
//       return 'Password cannot be longer than 13 characters';
//     }

//     // Check for letters and numbers only
//     if (!/^[a-zA-Z0-9]+$/.test(trimmedPassword)) {
//       return 'Password can only contain letters and numbers';
//     }

//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Password validation
//     const passwordError = validatePassword(password);
//     if (passwordError) {
//       setMessage(passwordError);
//       setIsSuccess(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setMessage('Passwords do not match!');
//       setIsSuccess(false);
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const response = await fetch(`${BASE_URL}/reset-password`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ token, password })
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         setIsSuccess(true);
//         setMessage('Password has been reset successfully!');
//         // Redirect to login page after 2 seconds
//         setTimeout(() => {
//           navigate('/signin');
//         }, 2000);
//       } else {
//         setIsSuccess(false);
//         setMessage(data.message || 'Failed to reset password');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setIsSuccess(false);
//       setMessage('An error occurred. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePasswordChange = (e) => {
//     const newPassword = e.target.value;
//     setPassword(newPassword);
//     // Clear any existing error messages when user starts typing
//     if (message) setMessage('');
//   };

//   const handleConfirmPasswordChange = (e) => {
//     const newConfirmPassword = e.target.value;
//     setConfirmPassword(newConfirmPassword);
//     // Clear any existing error messages when user starts typing
//     if (message) setMessage('');
//   };

//   const inputStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200";

//   if (!token) {
//     return (
//       <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
//             <div className="text-center">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
//               <p className="text-gray-600 mb-4">This password reset link is invalid or has expired.</p>
//               <Link
//                 to="/signin"
//                 className="text-[#D54B06] hover:text-[#B54000] transition-colors duration-200"
//               >
//                 Return to Sign In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
//         <p className="text-center text-gray-600">Enter your new password</p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 className={inputStyles}
//                 value={password}
//                 onChange={handlePasswordChange}
//                 required
//                 disabled={isLoading}
//               />
//               <p className="mt-1 text-sm text-gray-500">
//                 Password must be 8-13 characters long and contain only letters and numbers
//               </p>
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                 Confirm New Password
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 className={inputStyles}
//                 value={confirmPassword}
//                 onChange={handleConfirmPasswordChange}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <button
//               type="submit"
//               className={`w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-[#D54B06] hover:bg-[#B54000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D54B06] transition-colors duration-200 ${
//                 isLoading ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Resetting Password...' : 'Reset Password'}
//             </button>

//             {message && (
//               <div className={`mt-4 p-3 rounded-md ${
//                 isSuccess 
//                   ? 'bg-green-200 border border-green-400' 
//                   : 'bg-red-50 border border-red-200'
//               }`}>
//                 <p className={`text-center text-sm ${
//                   isSuccess ? 'text-green-900' : 'text-red-600'
//                 }`}>
//                   {message}
//                 </p>
//               </div>
//             )}

//             <div className="text-center">
//               <Link
//                 to="/signin"
//                 className="text-sm text-[#D54B06] hover:text-[#B54000] transition-colors duration-200"
//               >
//                 Back to Sign In
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { BASE_URL } from '../config/api.config';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const validatePassword = (password) => {
    const trimmedPassword = password.trim();
    
    if (trimmedPassword.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (trimmedPassword.length > 13) {
      return 'Password cannot be longer than 13 characters';
    }

    if (!/^[a-zA-Z0-9]+$/.test(trimmedPassword)) {
      return 'Password can only contain letters and numbers';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      setIsSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setMessage('Password has been reset successfully!');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsSuccess(false);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (message) setMessage('');
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (message) setMessage('');
  };

  const inputStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200";

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-4">This password reset link is invalid or has expired.</p>
              <Link
                to="/signin"
                className="text-[#D54B06] hover:text-[#B54000] transition-colors duration-200"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-center text-gray-600">Enter your new password</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={inputStyles}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex="-1"
                >
                  {showPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Password must be 8-13 characters long and contain only letters and numbers
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={inputStyles}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
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
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPassword;