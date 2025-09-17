// Home.jsx
import React, { useEffect, useState, useMemo } from "react";
import AssetTable from "./AssetTable";
import StockChart from "./StockChart";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Star,
  Filter,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { getCoinList, getTop50CoinList } from "../../State/Coin/Action";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import ChatBot from "./ChatBot";


// Component-specific styles for the custom scrollbar
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background-color: #fff7ed;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-image: linear-gradient(180deg, #fb923c, #f59e0b);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-image: linear-gradient(180deg, #f97316, #d97706);
  }

  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background-color: #1f2937;
  }

  .chat-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .chat-scrollbar::-webkit-scrollbar-track {
    background-color: rgba(254, 215, 170, 0.3);
    border-radius: 10px;
  }
  .chat-scrollbar::-webkit-scrollbar-thumb {
    background-image: linear-gradient(180deg, #fb923c, #f59e0b);
    border-radius: 10px;
  }
  .dark .chat-scrollbar::-webkit-scrollbar-track {
    background-color: rgba(124, 45, 18, 0.3);
  }
`;

function Home() {
  const dispatch = useDispatch();
  const { coin } = useSelector((store) => store);
  const [category, setCategory] = useState("all");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    dispatch(getCoinList(1));
  }, [dispatch]);

  const handleCategory = (value) => {
    setCategory(value);

    if (value === "Top 50") {
      dispatch(getTop50CoinList());
    } else if (value === "all") {
      dispatch(getCoinList(1));
    }
  };

  const categories = [
    { value: "all", label: "All", icon: TrendingUp },
    { value: "Top 50", label: "Top 50", icon: Star },
    { value: "Top Gainers", label: "Gainers", icon: ArrowUp },
    { value: "Top Losers", label: "Losers", icon: ArrowDown },
  ];

  const getDisplayData = useMemo(() => {
    let data = [];

    switch (category) {
      case "Top 50":
        data = coin.top50 || [];
        break;
      case "Top Gainers":
        data = (coin.coinList || [])
          .filter((coin) => coin.price_change_percentage_24h > 0)
          .sort(
            (a, b) =>
              b.price_change_percentage_24h - a.price_change_percentage_24h
          )
          .slice(0, 20);
        break;
      case "Top Losers":
        data = (coin.coinList || [])
          .filter((coin) => coin.price_change_percentage_24h < 0)
          .sort(
            (a, b) =>
              a.price_change_percentage_24h - b.price_change_percentage_24h
          )
          .slice(0, 20);
        break;
      case "all":
      default:
        data = coin.coinList || [];
        break;
    }

    if (sortBy) {
      data.sort((a, b) => {
        const aValue = a[sortBy] || 0;
        const bValue = b[sortBy] || 0;

        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    return data;
  }, [coin.coinList, coin.top50, category, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const sortOptions = [
    { value: "market_cap", label: "Market Cap" },
    { value: "current_price", label: "Price" },
    { value: "price_change_percentage_24h", label: "24h Change" },
    { value: "total_volume", label: "Volume" },
  ];

  const bitcoinInfo = useMemo(() => {
    const btc = coin.coinList?.find((c) => c.id === "bitcoin");
    if (!btc) return null;

    const format = (n) =>
      n == null ? "N/A" : new Intl.NumberFormat("en-US").format(n);

    return {
      image: btc.image,
      symbol: btc.symbol.toUpperCase(),
      name: btc.name,
      price: btc.current_price,
      change24h: btc.price_change_percentage_24h,
      marketCap: btc.market_cap,
      volume: btc.total_volume,
      format,
    };
  }, [coin.coinList]);

  const BitcoinHeader = () => {
    if (!bitcoinInfo) return null;

    const {
      image,
      symbol,
      name,
      price,
      change24h,
      marketCap,
      volume,
      format,
    } = bitcoinInfo;

    const isUp = change24h >= 0;

    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-orange-200 dark:border-orange-600">
            <AvatarImage src={image} alt={name} className="p-1" />
            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs">
              {symbol.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {name} <span className="uppercase text-gray-500">({symbol})</span>
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              ${format(price)}
            </p>
          </div>
        </div>

        <div className="text-right space-y-1 text-sm">
          <div
            className={`flex items-center justify-end gap-1 font-semibold ${
              isUp ? "text-green-500" : "text-red-500"
            }`}
          >
            {isUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {change24h.toFixed(2)}%
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            MCap: ${format(marketCap)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Vol: ${format(volume)}
          </div>
        </div>
      </div>
    );
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <div className="relative bg-gradient-to-br from-orange-50/20 via-yellow-50/10 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
        <div className="lg:flex gap-4 p-4">
          <div className="w-full lg:w-[55%] bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl border border-orange-200/30 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Crypto Assets
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {coin.loading
                      ? "Loading..."
                      : `Showing ${getDisplayData.length} coins`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-orange-300 dark:border-orange-600"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2 text-orange-500" />
                    {showFilters ? "Hide Filters" : "Filters"}
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-orange-800 dark:text-orange-200">
                    Sort By:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSort(option.value)}
                        className={`rounded-xl transition-all ${
                          sortBy === option.value
                            ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                            : "border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {categories.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <Button
                      key={cat.value}
                      onClick={() => handleCategory(cat.value)}
                      variant={category === cat.value ? "default" : "outline"}
                      size="sm"
                      className={`rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        category === cat.value
                          ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-400/30"
                          : "border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>

              {coin.loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <div className="h-[530px] overflow-y-auto custom-scrollbar pr-2">
                  <AssetTable coins={getDisplayData} category={category} />
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[45%] mt-4 lg:mt-0">
            <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl border border-orange-200/30 dark:border-gray-700/50 p-4 backdrop-blur-sm h-full">
              <BitcoinHeader />
              <div className="h-[400px]">
                <StockChart coinId="bitcoin" />
              </div>
            </div>
          </div>
        </div>

        <section className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={toggleChat}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-2xl shadow-orange-500/40 hover:shadow-orange-600/50 transition-all duration-300 hover:scale-110 group"
          >
            <MessageCircle className="w-6 h-6 -rotate-90 group-hover:rotate-0 transition-transform duration-300" />
            <span className="sr-only">Chat Bot</span>
          </Button>
        </section>

        <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </>
  );
}

export default Home;