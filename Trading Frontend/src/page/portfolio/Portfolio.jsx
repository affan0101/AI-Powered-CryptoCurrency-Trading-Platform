import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  PieChart,
  Plus,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserAssets } from "../../State/Asset/Action";

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

const formatPercentage = (value) => {
  if (!value) return "0.00%";
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

function Portfolio() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { asset } = useSelector((store) => store);

  useEffect(() => {
    if (jwt) {
      dispatch(getUserAssets(jwt));
    }
  }, [jwt, dispatch]);

  // Calculate portfolio statistics correctly
  const portfolioStats = asset.userAssets.reduce((stats, currentAsset) => {
    // Get current price - handle different possible data structures
    let currentPrice = 0;
    if (currentAsset.coin?.market_data?.current_price?.usd) {
      currentPrice = currentAsset.coin.market_data.current_price.usd;
    } else if (currentAsset.coin?.current_price) {
      currentPrice = currentAsset.coin.current_price;
    }
    
    // Get 24h price change - handle different possible data structures
    let priceChange24h = 0;
    if (currentAsset.coin?.market_data?.price_change_24h) {
      priceChange24h = currentAsset.coin.market_data.price_change_24h;
    } else if (currentAsset.coin?.price_change_24h) {
      priceChange24h = currentAsset.coin.price_change_24h;
    }
    
    // Get 24h price change percentage
    let priceChangePercent24h = 0;
    if (currentAsset.coin?.market_data?.price_change_percentage_24h) {
      priceChangePercent24h = currentAsset.coin.market_data.price_change_percentage_24h;
    } else if (currentAsset.coin?.price_change_percentage_24h) {
      priceChangePercent24h = currentAsset.coin.price_change_percentage_24h;
    }
    
    const assetValue = currentAsset.quantity * currentPrice;
    const assetChange24h = currentAsset.quantity * priceChange24h;
    
    return {
      totalValue: stats.totalValue + assetValue,
      totalChange24h: stats.totalChange24h + assetChange24h,
      totalInvestment: stats.totalInvestment + (currentAsset.buyPrice * currentAsset.quantity),
    };
  }, { totalValue: 0, totalChange24h: 0, totalInvestment: 0 });

  const { totalValue, totalChange24h, totalInvestment } = portfolioStats;
  const totalGainLoss = totalValue - totalInvestment;
  const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  if (asset.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading portfolio...</div>
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
              My Portfolio
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track your cryptocurrency investments
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg shadow-orange-400/30 hover:shadow-orange-500/40 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-orange-300 dark:border-orange-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2 text-orange-500" />
              Export
            </Button>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 shadow-lg border border-orange-200/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-lg flex items-center justify-center shadow-inner">
                <PieChart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Value
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 shadow-lg border border-orange-200/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center shadow-inner">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  24h Gain/Loss
                </p>
                <p
                  className={`text-xl font-bold ${
                    totalChange24h >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalChange24h >= 0 ? "+" : ""}{formatCurrency(Math.abs(totalChange24h))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 shadow-lg border border-orange-200/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center shadow-inner">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Gain/Loss
                </p>
                <p
                  className={`text-xl font-bold ${
                    totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalGainLoss >= 0 ? "+" : ""}{formatCurrency(Math.abs(totalGainLoss))}
                  <span className="text-sm ml-2">
                    ({formatPercentage(totalGainLossPercent)})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-orange-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-sm">
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Assets
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {asset.userAssets.length} assets
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-orange-200/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="overflow-auto max-h-[500px] custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 sticky top-0">
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Asset
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Price
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Units
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Change % (24h)
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Change (24h)
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4 text-right">
                        Value
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asset.userAssets.map((item) => {
                      // Get current price
                      let currentPrice = 0;
                      if (item.coin?.market_data?.current_price?.usd) {
                        currentPrice = item.coin.market_data.current_price.usd;
                      } else if (item.coin?.current_price) {
                        currentPrice = item.coin.current_price;
                      }
                      
                      // Get 24h price change
                      let priceChange24h = 0;
                      if (item.coin?.market_data?.price_change_24h) {
                        priceChange24h = item.coin.market_data.price_change_24h;
                      } else if (item.coin?.price_change_24h) {
                        priceChange24h = item.coin.price_change_24h;
                      }
                      
                      // Get 24h price change percentage
                      let priceChangePercent24h = 0;
                      if (item.coin?.market_data?.price_change_percentage_24h) {
                        priceChangePercent24h = item.coin.market_data.price_change_percentage_24h;
                      } else if (item.coin?.price_change_percentage_24h) {
                        priceChangePercent24h = item.coin.price_change_percentage_24h;
                      }
                      
                      const totalAssetValue = item.quantity * currentPrice;
                      const changeValue24h = item.quantity * priceChange24h;
                      const isPriceUp = priceChangePercent24h >= 0;
                      
                      // Get coin details
                      const coinName = item.coin?.name || "Unknown";
                      const coinSymbol = item.coin?.symbol?.toUpperCase() || "UNK";
                      const coinImage = item.coin?.image?.large || item.coin?.image;

                      return (
                        <TableRow
                          key={item.id}
                          className="group hover:bg-gradient-to-r from-orange-50/50 to-yellow-50/50 dark:hover:from-orange-900/20 dark:hover:to-yellow-900/20 transition-all duration-300 border-b border-orange-100/20 dark:border-gray-700/20 last:border-b-0"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 border border-orange-200 dark:border-orange-600 shadow-sm">
                                <AvatarImage
                                  src={coinImage}
                                  alt={coinName}
                                  className="p-1"
                                />
                                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs">
                                  {coinSymbol.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-semibold text-gray-900 dark:text-white block">
                                  {coinName}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">
                                  {coinSymbol}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                            {formatCurrency(currentPrice)}
                          </TableCell>
                          <TableCell className="py-4 text-gray-600 dark:text-gray-400">
                            {item.quantity.toFixed(6)}
                          </TableCell>
                          <TableCell className="py-4">
                            <div
                              className={`flex items-center gap-1 font-semibold ${
                                isPriceUp ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {isPriceUp ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {formatPercentage(priceChangePercent24h)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div
                              className={`font-semibold ${
                                isPriceUp ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {isPriceUp ? "+" : ""}{formatCurrency(Math.abs(changeValue24h))}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 font-semibold text-gray-900 dark:text-white text-right">
                            {formatCurrency(totalAssetValue)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
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

export default Portfolio;