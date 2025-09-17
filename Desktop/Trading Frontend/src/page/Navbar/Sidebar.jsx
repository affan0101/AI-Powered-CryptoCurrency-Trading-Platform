import React, { useState, useEffect } from "react";
import { 
  Home, 
  PieChart, 
  Eye, 
  Activity, 
  Wallet, 
  CreditCard, 
  Download, 
  User,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Settings,
  Bell,
  HelpCircle
} from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../State/Auth/Action";
import { getUserWallet } from "../../State/Wallet/Action";

const menu = [
  { name: "Dashboard", path: "/", Icon: Home, description: "Market overview and trends" },
  { name: "Portfolio", path: "/portfolio", Icon: PieChart, description: "Your investments" },
  { name: "Watchlist", path: "/watchlist", Icon: Eye, description: "Tracked coins" },
  { name: "Activity", path: "/activity", Icon: Activity, description: "Trading history" },
  { name: "Wallet", path: "/wallet", Icon: Wallet, description: "Balance & transactions" },
  { name: "Payment Methods", path: "/payment-details", Icon: CreditCard, description: "Bank & cards" },
  { name: "Withdraw", path: "/withdrawal", Icon: Download, description: "Cash out funds" },
  { name: "Profile", path: "/profile", Icon: User, description: "Account settings" },
  
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { wallet, auth } = useSelector(store => store);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (auth.jwt) {
      dispatch(getUserWallet(auth.jwt));
    }
  }, [auth.jwt, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path) => activeItem === path;


  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 border-r border-orange-200/50 dark:border-gray-700/50">
    
      

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menu.map((item, index) => {
          const IconComponent = item.Icon;
          const active = isActive(item.path);
          
          return (
            <SheetClose key={index} asChild>
              <button 
                onClick={() => {
                  if (item.name === "Logout") {
                    handleLogout();
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`flex items-center justify-between p-3 w-full rounded-xl transition-all duration-300 group ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-400/30"
                    : "bg-white/80 dark:bg-gray-800/80 border border-orange-100/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-md backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    active
                      ? "bg-white/20"
                      : "bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 group-hover:from-orange-200 group-hover:to-yellow-200 dark:group-hover:from-orange-800 dark:group-hover:to-yellow-800"
                  }`}>
                    <IconComponent className={`h-5 w-5 ${
                      active
                        ? "text-white"
                        : "text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300"
                    }`} />
                  </div>
                  <div className="text-left">
                    <span className={`font-medium block ${
                      active ? "text-white" : "text-gray-800 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                    }`}>
                      {item.name}
                    </span>
                    <span className={`text-xs ${
                      active ? "text-white/80" : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {item.description}
                    </span>
                  </div>
                </div>
                {!active && (
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                )}
              </button>
            </SheetClose>
          );
        })}
      </nav>

     

      {/* Logout Button */}
      <div className="p-4 border-t border-orange-200/30 dark:border-gray-700/30">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 group"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-800/30">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="font-medium">Logout</span>
          <ChevronRight className="h-4 w-4 ml-auto opacity-60 group-hover:opacity-100" />
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 165, 0, 0.1);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ffa500, #ffb347);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ff8c00, #ffa042);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 165, 0, 0.15);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ff8c00, #e67700);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ff7700, #cc6600);
        }
      `}</style>
    </div>
  );
}

export default Sidebar;