import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { TrendingUp, TrendingDown, Filter, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../State/order/Action";

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

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString()
  };
};

function Activity() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { order } = useSelector((store) => store);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (jwt) {
      dispatch(getAllOrders(jwt));
    }
  }, [jwt, dispatch]);

  // Filter orders based on selected filter
  const filteredOrders = order.orders?.filter(orderItem => {
    if (filter === "all") return true;
    if (filter === "profit") {
      // For sell orders, check if sell price > buy price
      if (orderItem.orderType === "SELL") {
        const sellPrice = orderItem.orderItem?.sellPrice || 0;
        const buyPrice = orderItem.orderItem?.buyPrice || 0;
        return sellPrice > buyPrice;
      }
      return false;
    }
    if (filter === "loss") {
      // For sell orders, check if sell price < buy price
      if (orderItem.orderType === "SELL") {
        const sellPrice = orderItem.orderItem?.sellPrice || 0;
        const buyPrice = orderItem.orderItem?.buyPrice || 0;
        return sellPrice < buyPrice;
      }
      return false;
    }
    return true;
  }) || [];

  if (order.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading activity...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6">
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        /* Light theme scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 165, 0, 0.1);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ffa500, #ffb347);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ff8c00, #ffa042);
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Dark theme scrollbar */
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 165, 0, 0.15);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ff8c00, #e67700);
          border: 2px solid rgba(0, 0, 0, 0.3);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ff7700, #cc6600);
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ffa500 rgba(255, 165, 0, 0.1);
        }
        
        .dark .custom-scrollbar {
          scrollbar-color: #ff8c00 rgba(255, 165, 0, 0.15);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Trading Activity
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your complete trading history
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-xl transition-all duration-300"
            >
              All Activities
            </Button>
            <Button 
              variant={filter === "profit" ? "default" : "outline"}
              onClick={() => setFilter("profit")}
              className="rounded-xl transition-all duration-300"
            >
              Profitable
            </Button>
            <Button 
              variant={filter === "loss" ? "default" : "outline"}
              onClick={() => setFilter("loss")}
              className="rounded-xl transition-all duration-300"
            >
              Losses
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

        {/* Activity Table */}
        <div className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-orange-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-sm">
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredOrders.length} activities
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-orange-200/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="overflow-auto max-h-[600px] custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 sticky top-0">
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Date & Time
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Trading Pair
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Quantity
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Buy Price
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Sell Price
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Order Type
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4 text-right">
                        Profit/Loss
                      </TableHead>
                      <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">
                        Total Value
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">
                          No trading activity found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((orderItem) => {
                        const coin = orderItem.orderItem?.coin;
                        const formattedDate = formatDate(orderItem.timestamp);
                        const quantity = orderItem.orderItem?.quantity || 0;
                        const buyPrice = orderItem.orderItem?.buyPrice || 0;
                        const sellPrice = orderItem.orderItem?.sellPrice || 0;
                        const totalValue = orderItem.price || 0;
                        
                        // Calculate profit/loss for sell orders
                        let profitLoss = 0;
                        let profitLossType = "neutral";
                        
                        if (orderItem.orderType === "SELL" && buyPrice > 0) {
                          profitLoss = ((sellPrice - buyPrice) * quantity);
                          profitLossType = profitLoss >= 0 ? "profit" : "loss";
                        }

                        return (
                          <TableRow 
                            key={orderItem.id} 
                            className="group hover:bg-gradient-to-r from-orange-50/70 to-yellow-50/70 dark:hover:from-orange-900/30 dark:hover:to-yellow-900/30 transition-all duration-300 border-b border-orange-100/20 dark:border-gray-700/20 last:border-b-0 transform hover:scale-[1.01] hover:shadow-lg"
                          >
                            <TableCell className="py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {formattedDate.date}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {formattedDate.time}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8 border border-orange-200 dark:border-orange-600 shadow-sm">
                                  <AvatarImage src={coin?.image} alt={coin?.name} className="p-1" />
                                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs">
                                    {coin?.symbol?.slice(0, 2) || "CO"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {coin?.symbol ? `${coin.symbol.toUpperCase()}/USD` : "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-gray-600 dark:text-gray-400">
                              {quantity.toFixed(6)}
                            </TableCell>
                            <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                              {buyPrice > 0 ? formatCurrency(buyPrice) : "N/A"}
                            </TableCell>
                            <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                              {sellPrice > 0 ? formatCurrency(sellPrice) : "N/A"}
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge 
                                variant="outline" 
                                className={
                                  orderItem.orderType === "BUY" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700" 
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700"
                                }
                              >
                                {orderItem.orderType}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              {profitLossType !== "neutral" ? (
                                <div className={`flex items-center justify-end gap-1 font-semibold ${
                                  profitLossType === "profit" ? "text-green-500" : "text-red-500"
                                }`}>
                                  {profitLossType === "profit" ? (
                                    <TrendingUp className="h-4 w-4" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4" />
                                  )}
                                  {formatCurrency(profitLoss)}
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                            <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                              {formatCurrency(totalValue)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
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

export default Activity;