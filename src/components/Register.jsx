import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";
import emailjs from '@emailjs/browser';
import logo from '../assets/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [message, setMessage] = useState("");
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [dialog, setDialog] = useState({
    show: false,
    type: "",
    message: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    return otp;
  };

  const sendOTP = async (email) => {
    try {
      const otp = generateOTP();
      const templateParams = {
        to_email: email,
        otp: otp,
        username: formData.username
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_OTP_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_OTP_PUBLIC_KEY
      );

      setOtpSent(true);
      setMessage("OTP sent to your email!");
      alert("OTP sent to your email");
    } catch (error) {
      console.error('Error sending OTP:', error);
      setDialog({
        show: true,
        type: "error",
        message: "Failed to send OTP. Please try again."
      });
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!formData.email) {
      setMessage("Please enter your email first");
      return;
    }
    sendOTP(formData.email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      setMessage("Please request an OTP first");
      return;
    }

    if (formData.otp !== generatedOtp) {
      setMessage("Invalid OTP. Please try again.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await registerUser(userData).unwrap();
      setDialog({
        show: true,
        type: "success",
        message: "Registration successful! Redirecting to login..."
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setDialog({
        show: true,
        type: "error",
        message: err.data?.message || "Registration failed. User Already Exists"
      });
    }
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, show: false }));
  };

  return (
    <section className='min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-30 to-gray-50 p-4'>
      {/* Dialog Modal */}
      {dialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto border-t-4 ${dialog.type === "success" ? "border-pink-500" : "border-red-500"}`}>
            <h3 className={`text-xl font-semibold ${dialog.type === "success" ? "text-pink-600" : "text-red-600"}`}>
              {dialog.type === "success" ? "Success!" : "Error"}
            </h3>
            <p className="mt-2 mb-4">{dialog.message}</p>
            <button
              onClick={closeDialog}
              className={`w-full py-2 rounded-md ${dialog.type === "success"
                ? "bg-pink-500 hover:bg-pink-600"
                : "bg-red-500 hover:bg-red-600"
                } text-white`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className='w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden'>
        {/* Logo Header with Pink Background */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-400 py-8 px-6 flex flex-col items-center">
          <div className="relative">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md" 
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">Create Your Account</h1>
          {/* <p className="mt-1 text-pink-100">Join our community</p> */}
        </div>

        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="Enter your email"
                  required
                  disabled={otpSent}
                />
              </div>
              {!otpSent && (
                <button
                  onClick={handleSendOTP}
                  className="px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-lg hover:from-pink-700 hover:to-pink-600 transition-colors"
                >
                  Send OTP
                </button>
              )}
            </div>

            {otpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Verification
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="Enter OTP"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                placeholder="Confirm password"
                required
              />
            </div>

            {message && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-medium rounded-lg shadow-md transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-pink-600 hover:text-pink-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;