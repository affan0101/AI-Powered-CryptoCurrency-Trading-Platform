import React, { useState } from "react";
import { EnvelopeClosedIcon, ArrowLeftIcon } from "@radix-ui/react-icons";

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset email:", email);
    // Handle password reset logic here
  };

  return (
    <div>
      <button
        onClick={onBackToLogin}
        className="flex items-center text-sm text-orange-600 dark:text-orange-400 mb-4 hover:underline transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to login
      </button>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Enter your email to receive a reset link.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="forgot-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="relative">
            <EnvelopeClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="forgot-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-orange-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white transition-colors"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-3 rounded-lg font-medium shadow-lg shadow-orange-400/30 transition-all duration-300 transform hover:scale-[1.02]"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
