// src/components/Navbar.js

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { DragHandleHorizontalIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Sidebar from "./Sidebar";
import { TrendingUp, X, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { searchCoins } from "../../State/Coin/Action";
import SearchCoin from "../Search/SearchCoin";

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { auth, coin } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle changes in the search input
  const handleSearchChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    if (newKeyword.trim()) {
      dispatch(searchCoins(newKeyword));
    }
  };

  // Function to clear search and close overlays
  const handleClearAndClose = () => {
    setKeyword("");
    setIsSearchOpen(false);
  };

  return (
    <>
      <div
        className="px-4 py-2.5 border-b z-50 bg-gradient-to-r from-orange-200 to-yellow-100 dark:from-gray-900 dark:to-gray-800 backdrop-blur-md sticky
        top-0 left-0 right-0 flex justify-between items-center shadow-md shadow-orange-100/30 dark:shadow-gray-900"
      >
        {/* Left Side: Mobile Menu & Desktop Logo */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-10 w-10 hover:bg-orange-200 dark:hover:bg-orange-800/40 border border-orange-300/60 dark:border-orange-600/40 transition-all duration-200 hover:scale-105 bg-white/80 dark:bg-gray-800/90"
              >
                <DragHandleHorizontalIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-72 border-r-0 p-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl"
              side="left"
            >
              <SheetHeader className="p-4 border-b border-orange-200/50 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <SheetClose asChild>
                    <Link to="/">
                      <SheetTitle className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h1 className="text-lg font-bold text-gray-900 dark:text-white">CryptoTrade</h1>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Trading Platform Pvt.Ltd</p>
                        </div>
                      </SheetTitle>
                    </Link>
                  </SheetClose>
                  <SheetClose className="rounded-lg p-1.5 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <X className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <Sidebar />
            </SheetContent>
          </Sheet>
          <Link to="/" className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">CryptoTrade</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Trading</span>
            </div>
          </Link>
        </div>

        {/* Centered Search Bar - Desktop */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-400 z-10" />
            <input
              value={keyword}
              onChange={handleSearchChange}
              placeholder="Search cryptocurrencies..."
              className="pl-9 pr-3 py-2 w-80 rounded-xl border border-orange-200/60 dark:border-orange-700/40 focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white/90 dark:bg-gray-800/90 shadow-sm backdrop-blur-sm outline-none transition-all duration-200 placeholder:text-orange-300 dark:placeholder:text-orange-500 text-orange-800 dark:text-orange-200 text-sm"
            />
            {keyword && (
              <div className="absolute top-full mt-2 w-full rounded-xl bg-white dark:bg-gray-800 shadow-lg z-50 border border-orange-200/60 dark:border-orange-700/40">
                <SearchCoin
                  searchResults={coin.searchCoinList}
                  loading={coin.loading}
                  onCoinSelect={handleClearAndClose}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right side navigation items */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden rounded-xl h-9 w-9 hover:bg-orange-200 dark:hover:bg-orange-800/40 border border-orange-200/40 dark:border-orange-700/30 bg-white/80 dark:bg-gray-800/90"
          >
            <Search className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </Button>
          {auth.user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 p-2 rounded-xl hover:bg-orange-200/60 dark:hover:bg-orange-800/40 cursor-pointer transition-all duration-200 border border-orange-200/30 dark:border-orange-700/20 bg-white/80 dark:bg-gray-800/90"
              >
                <Avatar className="w-8 h-8 rounded-full border border-orange-400 dark:border-orange-600">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" className="rounded-full" />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-semibold">
                    {auth.user.fullName ? auth.user.fullName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">{auth.user.fullName}</span>
                <ChevronDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="hidden sm:flex text-orange-700 dark:text-orange-300 hover:text-white dark:hover:text-white border border-orange-400/40 dark:border-orange-600/30 rounded-xl hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-600 bg-white/80 dark:bg-gray-800/90 transition-all duration-200 px-3 py-1.5 text-sm font-medium"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-orange-500/30 rounded-xl transition-all duration-200 hover:scale-105 px-3 py-1.5 text-sm font-semibold border border-orange-400/20"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden fixed top-14 left-0 right-0 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 border-b border-orange-200 dark:border-gray-700 p-3 shadow-md z-40">
          <div className="relative">
            <div className="flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-orange-500 z-10" />
              <input
                value={keyword}
                onChange={handleSearchChange}
                placeholder="Search BTC, ETH, SOL..."
                className="pl-10 pr-3 py-2 w-full rounded-xl border border-orange-300/50 dark:border-orange-600/40 focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white/90 dark:bg-gray-800/90 outline-none placeholder:text-orange-400 dark:placeholder:text-orange-500 text-orange-800 dark:text-orange-200 text-sm font-medium"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearAndClose}
                className="absolute right-2 h-7 w-7 text-orange-600 dark:text-orange-400"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {keyword && (
              <div className="mt-2 w-full rounded-xl bg-white dark:bg-gray-800 shadow-lg z-50 border border-orange-200/60 dark:border-orange-700/40">
                <SearchCoin
                  searchResults={coin.searchCoinList}
                  loading={coin.loading}
                  onCoinSelect={handleClearAndClose}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;