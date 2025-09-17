import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DotFilledIcon, Cross2Icon } from "@radix-ui/react-icons";
import { TrendingUp, TrendingDown, BarChart3, Users, Coins, Activity, Calendar, Sparkles, Target, Star } from 'lucide-react';
import TradingForm from "./TradingForm";
import StockChart from "../Home/StockChart";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCoinDetails } from "../../State/Coin/Action";
import { getAssetDetails } from "../../State/Asset/Action"; // Removed getUserAssets as it's not used
import { getUserWallet } from "../../State/Wallet/Action";
import { payOrder } from "../../State/order/Action";
import { addItemToWatchlist, getUserWatchlist } from "../../State/Watchlist/Action";

// Helper functions
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


function StockDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");
  const { coin, wallet, asset, watchlist } = useSelector((store) => store);

  const [tradeType, setTradeType] = useState("buy");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (jwt && id) {
      dispatch(fetchCoinDetails({ coinId: id, jwt }));
      dispatch(getAssetDetails({ coinId: id, jwt }));
      dispatch(getUserWallet(jwt));
      // Pass the JWT to the action creator
      dispatch(getUserWatchlist()); 
    }
  }, [id, jwt, dispatch]);

  const handleTrade = async (orderData) => {
    if (jwt) {
      try {
        await dispatch(payOrder({ jwt, orderData }));
        dispatch(getUserWallet(jwt));
        dispatch(getAssetDetails({ coinId: id, jwt }));
        // Corrected action to fetch user assets, if needed, but not in original code
        // dispatch(getUserAssets(jwt));
        console.log("Trade successful, wallet and assets updated.");
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Trade failed:", error);
      }
    }
  };

  const handleToggleWatchlist = () => {
    if (jwt && coin.coinDetails?.id) { // Use optional chaining to avoid errors
      dispatch(addItemToWatchlist(coin.coinDetails.id, jwt));
    }
  };

  // Check if the current coin is in the watchlist. The backend returns a new watchlist on add/remove.
  const isCoinInWatchlist = watchlist.watchlist?.coins?.some(
    (item) => item.id === coin.coinDetails?.id
  );

  const priceChange = coin.coinDetails?.market_data?.price_change_percentage_24h || 0;
  const isPriceUp = priceChange >= 0;
  const marketData = coin.coinDetails?.market_data || {};

  const getAdditionalStats = () => {
    return [
      {
        icon: <Activity className="h-4 w-4" />,
        label: "24H Trading Volume",
        value: formatCurrency(marketData.total_volume?.usd),
      },
      {
        icon: <BarChart3 className="h-4 w-4" />,
        label: "Market Cap Dominance",
        value: marketData.market_cap?.usd ? `${((marketData.market_cap.usd / 2_500_000_000_000) * 100).toFixed(2)}%` : "N/A",
      },
      {
        icon: <Coins className="h-4 w-4" />,
        label: "Circulating Supply",
        value: formatLargeNumber(marketData.circulating_supply),
      },
      {
        icon: <TrendingUp className="h-4 w-4" />,
        label: "All-Time High",
        value: formatCurrency(marketData.ath?.usd),
        change: marketData.ath_change_percentage?.usd ?
          `${marketData.ath_change_percentage.usd.toFixed(2)}% from ATH` : undefined
      },
      {
        icon: <TrendingDown className="h-4 w-4" />,
        label: "All-Time Low",
        value: formatCurrency(marketData.atl?.usd),
        change: marketData.atl_change_percentage?.usd ?
          `${marketData.atl_change_percentage.usd.toFixed(2)}% from ATL` : undefined
      },
      {
        icon: <Users className="h-4 w-4" />,
        label: "Market Cap Rank",
        value: `#${coin.coinDetails?.market_cap_rank || 'N/A'}`,
      },
      {
        icon: <Calendar className="h-4 w-4" />,
        label: "24H Price Range",
        value: `${formatCurrency(marketData.low_24h?.usd)} - ${formatCurrency(marketData.high_24h?.usd)}`,
      },
      {
        icon: <TrendingUp className="h-4 w-4" />,
        label: "Volume/Market Cap",
        value: marketData.total_volume?.usd && marketData.market_cap?.usd ?
          `${((marketData.total_volume.usd / marketData.market_cap.usd) * 100).toFixed(2)}%` : "N/A",
      },
      {
        icon: <Sparkles className="h-4 w-4" />,
        label: "Price Change (7D)",
        value: formatPercentage(marketData.price_change_percentage_7d),
      },
      {
        icon: <Target className="h-4 w-4" />,
        label: "Price Change (30D)",
        value: formatPercentage(marketData.price_change_percentage_30d),
      }
    ];
  };

  if (coin.loading || !coin.coinDetails || !wallet.userWallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading coin data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-8xl mx-auto h-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-6 bg-gradient-to-r from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-orange-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="w-20 h-20 border-2 border-orange-300 dark:border-orange-600 shadow-lg">
              <AvatarImage src={coin.coinDetails.image?.large} className="rounded-full p-2" />
              <AvatarFallback className="w-full h-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold text-2xl">
                {coin.coinDetails.symbol?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{coin.coinDetails.symbol?.toUpperCase()}</h1>
                <DotFilledIcon className="text-gray-400" />
                <p className="text-xl text-gray-600 dark:text-gray-400">{coin.coinDetails.name}</p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{formatCurrency(marketData.current_price?.usd)}</span>
                <span className={`${isPriceUp ? "text-green-600 bg-green-100 dark:bg-green-900/30" : "text-red-600 bg-red-100 dark:bg-red-900/30"} font-semibold text-lg md:text-xl px-3 py-2 rounded-lg`}>
                  {isPriceUp ? "+" : ""}{priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleWatchlist}
              className={`p-3 rounded-full transition-colors duration-300 ${isCoinInWatchlist ? 'bg-yellow-400/20 text-yellow-500 hover:bg-yellow-400/30' : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}
            >
              <Star className={`h-6 w-6 ${isCoinInWatchlist ? 'fill-current' : ''}`} />
            </button>
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium py-3 px-8 rounded-xl shadow-lg shadow-orange-400/30 transition-all duration-300 transform hover:scale-105 text-lg" onClick={() => setIsDialogOpen(true)}>
                  TRADE
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 border border-orange-200 dark:border-gray-700 focus:outline-none overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-orange-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-900">
                    <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tradeType === "buy" ? `Buy ${coin.coinDetails.name}` : `Sell ${coin.coinDetails.name}`}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="text-gray-500 hover:text-orange-600 dark:hover:text-orange-400">
                        <Cross2Icon className="h-6 w-6" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <TradingForm
                    tradeType={tradeType}
                    setTradeType={setTradeType}
                    coin={coin.coinDetails}
                    wallet={wallet.userWallet}
                    asset={asset.assetDetails}
                    handleTrade={handleTrade}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>

        {/* Chart and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[70vh] mb-6">
          <div className="lg:col-span-3 bg-gradient-to-r from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-orange-200 dark:border-gray-700 p-6 h-full">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{coin.coinDetails.symbol?.toUpperCase()}/USD Price Chart</h2>
              </div>
              <div className="flex-grow">
                <StockChart coinId={id} />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-orange-200 dark:border-gray-700 p-6 h-full overflow-hidden">
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-orange-500" /> Market Statistics
              </h2>
              <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                {getAdditionalStats().map((stat, index) => (
                  <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-orange-100 dark:border-gray-600">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-orange-500 dark:text-orange-400 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">{stat.icon}</div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</p>
                    </div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{stat.value}</p>
                    {stat.change && <p className={`text-sm mt-2 ${stat.change.includes('-') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{stat.change}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetails;