import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";

// Import the separated form components
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  // Reset showPassword state when the tab changes to prevent state leakage
  const handleTabChange = (tab) => {
    setShowPassword(false);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -z-10 opacity-50">
        <div className="bg-gradient-to-r from-orange-400/20 to-yellow-400/20 dark:from-orange-600/10 dark:to-yellow-600/10 w-96 h-96 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-50">
        <div className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 dark:from-amber-600/10 dark:to-orange-600/10 w-80 h-80 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Crypto Trading
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Trade smarter, grow faster</p>
        </div>

        <Tabs.Root value={activeTab} onValueChange={handleTabChange} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-orange-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
          
          {/* Conditionally render Tab Triggers to hide them on the forgot password screen */}
          {activeTab !== 'forgot' && (
            <Tabs.List className="flex border-b border-orange-100 dark:border-gray-700">
              <Tabs.Trigger
                value="login"
                className={`flex-1 py-4 text-center font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${
                  activeTab === "login"
                    ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-500 bg-gradient-to-t from-orange-50 to-transparent dark:from-orange-900/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-300"
                }`}
              >
                Login
              </Tabs.Trigger>
              <Tabs.Trigger
                value="signup"
                className={`flex-1 py-4 text-center font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${
                  activeTab === "signup"
                    ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-500 bg-gradient-to-t from-orange-50 to-transparent dark:from-orange-900/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-300"
                }`}
              >
                Sign Up
              </Tabs.Trigger>
            </Tabs.List>
          )}

          {/* Login Form Content */}
          <Tabs.Content value="login" className="p-6 md:p-8 focus:outline-none">
            <SigninForm
              onSwitchToForgotPassword={() => setActiveTab("forgot")}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              setActiveTab={setActiveTab}
            />
          </Tabs.Content>

          {/* Signup Form Content */}
          <Tabs.Content value="signup" className="p-6 md:p-8 focus:outline-none">
            <SignupForm
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              setActiveTab={setActiveTab}
            />
          </Tabs.Content>

          {/* Forgot Password Form Content */}
          <Tabs.Content value="forgot" className="p-6 md:p-8 focus:outline-none">
            <ForgotPasswordForm
              onBackToLogin={() => setActiveTab("login")}
            />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default Auth;
