import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  Eye,
  Search,
  Filter,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from 'react-redux';
import { addItemToWatchlist, getUserWatchlist } from '../../State/Watchlist/Action';
import { useNavigate } from 'react-router-dom';

// Helper functions for formatting
const formatCurrency = (amount) => {
  if (!amount) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatLargeNumber = (num) => {
  if (!num) return "0";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toLocaleString();
};

const formatPercentage = (value) => {
  if (!value) return "0.00%";
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

function Watchlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { watchlist } = useSelector(store => store);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (jwt) {
      dispatch(getUserWatchlist());
    }
  }, [jwt, dispatch]);

  const filteredWatchlist = watchlist.items?.filter(coin =>
    coin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const removeFromWatchlist = (coinId, e) => {
    e.stopPropagation();
    if (jwt && coinId) {
      dispatch(addItemToWatchlist(coinId, jwt));
    }
  };

  const navigateToCoin = (coinId) => {
    if (coinId) {
      navigate(`/coin/${coinId}`);
    }
  };

  if (watchlist.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading watchlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              My Watchlist
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track your favorite cryptocurrencies
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg shadow-orange-400/30 hover:shadow-orange-500/40 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add Coin
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
            <Input
              type="text"
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-orange-200 dark:border-orange-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-orange-400/30"
            />
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-orange-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-sm">
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Watched Coins
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredWatchlist.length} coins
              </div>
            </div>

            {filteredWatchlist.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No coins in your watchlist
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Add coins to your watchlist to track them here.
                </p>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-orange-200/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="overflow-auto max-h-[600px] custom-scrollbar">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 sticky top-0">
                        <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                          COIN
                        </TableHead>
                        <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                          SYMBOL
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-orange-600 dark:text-orange-400 font-semibold py-4">
                          VOLUME
                        </TableHead>
                        <TableHead className="hidden lg:table-cell text-orange-600 dark:text-orange-400 font-semibold py-4">
                          MARKET CAP
                        </TableHead>
                        <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                          24H
                        </TableHead>
                        <TableHead className="text-right text-orange-600 dark:text-orange-400 font-semibold py-4">
                          PRICE
                        </TableHead>
                        <TableHead className="text-right text-orange-600 dark:text-orange-400 font-semibold py-4">
                          ACTIONS
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWatchlist.map((crypto) => {
                        const currentPrice = crypto?.current_price || crypto?.market_data?.current_price?.usd || 0;
                        const priceChange24h = crypto?.price_change_percentage_24h || crypto?.market_data?.price_change_percentage_24h || 0;
                        const totalVolume = crypto?.total_volume || crypto?.market_data?.total_volume?.usd || 0;
                        const marketCap = crypto?.market_cap || crypto?.market_data?.market_cap?.usd || 0;
                        const isPriceUp = priceChange24h >= 0;
                        const image = crypto?.image?.large || crypto?.image;
                        const name = crypto?.name || "Unknown Coin";
                        const symbol = crypto?.symbol || "UNK";
                        const coinId = crypto?.id;

                        return (
                          <TableRow
                            key={coinId}
                            className="group hover:bg-gradient-to-r from-orange-50/70 to-yellow-50/70 dark:hover:from-orange-900/30 dark:hover:to-yellow-900/30 transition-all duration-300 border-b border-orange-100/20 dark:border-gray-700/20 last:border-b-0 cursor-pointer"
                            onClick={() => navigateToCoin(coinId)}
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 border border-orange-200 dark:border-orange-600 shadow-sm">
                                  <AvatarImage src={image} alt={name} className="p-1" />
                                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs">
                                    {symbol.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-gray-600 dark:text-gray-400 font-medium">
                              {symbol.toUpperCase()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-4 text-gray-600 dark:text-gray-400">
                              {formatLargeNumber(totalVolume)}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell py-4 text-gray-600 dark:text-gray-400">
                              {formatLargeNumber(marketCap)}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className={`flex items-center gap-1 font-semibold ${
                                isPriceUp ? "text-green-500" : "text-red-500"
                              }`}>
                                {isPriceUp ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : (
                                  <TrendingDown className="h-4 w-4" />
                                )}
                                {formatPercentage(priceChange24h)}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-right font-bold text-gray-900 dark:text-white">
                              {formatCurrency(currentPrice)}
                            </TableCell>
                            <TableCell className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => removeFromWatchlist(coinId, e)}
                                className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -z-10">
          <div className="bg-gradient-to-r from-orange-400/10 to-yellow-400/10 dark:from-orange-600/5 dark:to-yellow-600/5 w-96 h-96 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10">
          <div className="bg-gradient-to-r from-amber-400/10 to-orange-400/10 dark:from-amber-600/5 dark:to-orange-600/5 w-80 h-80 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

export default Watchlist;