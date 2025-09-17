import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./page/Home/Home";
import Navbar from "./page/Navbar/Navbar";
import Portfolio from "./page/portfolio/Portfolio";
import Activity from "./page/Activity/Activity";
import Wallet from "./page/Wallet/Wallet";
import Withdrawal from "./page/Withdrawal/Withdrawal";
import PaymentDetails from "./page/Payment Details/PaymentDetail";
import StockDetails from "./page/Stock Details/StockDetails";
import Watchlist from "./page/Watchlist/Watchlist";
import Profile from "./page/Profile/Profile";
import SearchCoin from "./page/Search/SearchCoin";
import Notfound from "./page/NotFound/Notfound";
import Auth from "./page/Auth/Auth";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getUser } from "./State/Auth/Action";

// A component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { auth } = useSelector((store) => store);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Give Redux a moment to load the user data
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show nothing while checking authentication status
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  // Check if user is authenticated OR if there's a JWT token in localStorage
  const jwt = localStorage.getItem("jwt");
  if (!auth.user && !jwt) {
    return <Navigate to="/auth" />;
  }

  // If the user is authenticated, render the requested component
  return children;
};

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUser(jwt)).then(() => {
        setIsAppInitialized(true);
      });
    } else {
      setIsAppInitialized(true);
    }
  }, [auth.jwt, dispatch]);

  // Show a loading state while the app is initializing
  if (!isAppInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar is now outside the conditional logic, so it's always visible */}
      <Navbar />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/market/:id" element={<StockDetails />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/search" element={<SearchCoin />} />

        {/* --- Protected Routes --- */}
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdrawal"
          element={
            <ProtectedRoute>
              <Withdrawal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-details"
          element={
            <ProtectedRoute>
              <PaymentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* --- Not Found Route --- */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;