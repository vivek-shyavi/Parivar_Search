
// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { BASE_URL } from '../config/api.config';

// const SetPassword = () => {
//   const { token } = useParams();
//   const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [messageType, setMessageType] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       setMessage('Passwords do not match!');
//       setMessageType('error');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${BASE_URL}/set-password/${token}`, {
//         password: formData.password,
//       });
//       setMessage(response.data.message);
//       setMessageType('success');
//       if (response.status === 200) {
//         setTimeout(() => navigate('/signin'), 3000);
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'An error occurred.');
//       setMessageType('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const MessageContainer = ({ type, message }) => {
//     const baseClasses = "mt-4 p-4 rounded-md text-sm font-medium text-center";
//     const typeClasses = {
//       success: "bg-green-50 text-green-800 border border-green-200",
//       error: "bg-red-50 text-red-800 border border-red-200"
//     };

//     return message ? (
//       <div className={`${baseClasses} ${typeClasses[type]} animate-fade-in`}>
//         {message}
//       </div>
//     ) : null;
//   };

//   const inputStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200";

//   return (
//     <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-bold text-gray-900">Set Your Password</h2>
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
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 className={inputStyles}
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-[#D54B06] hover:bg-[#B54000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D54B06] transition-colors duration-200 disabled:opacity-50"
//             >
//               {isLoading ? (
//                 <div className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Setting Password...
//                 </div>
//               ) : (
//                 'Set Password'
//               )}
//             </button>

//             <MessageContainer type={messageType} message={message} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SetPassword;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/api.config';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const SetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/set-password/${token}`, {
        password: formData.password,
      });
      setMessage(response.data.message);
      setMessageType('success');
      if (response.status === 200) {
        setTimeout(() => navigate('/signin'), 3000);
      }
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

  const inputStyles = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D54B06] focus:outline-none focus:ring-1 focus:ring-[#D54B06] transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">Set Your Password</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`${inputStyles} pr-10`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`${inputStyles} pr-10`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-[#D54B06] hover:bg-[#B54000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D54B06] transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting Password...
                </div>
              ) : (
                'Set Password'
              )}
            </button>

            <MessageContainer type={messageType} message={message} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;