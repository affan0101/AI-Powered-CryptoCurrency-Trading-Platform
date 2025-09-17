import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

function TradingForm({ tradeType, setTradeType, coin, wallet, asset, handleTrade }) {
  const [amount, setAmount] = useState('');

  // Reset the input field when the user switches between "Buy" and "Sell"
  useEffect(() => {
    setAmount('');
  }, [tradeType]);

  // --- Derived values from props ---
  // These will automatically update when the props (coin, wallet, asset) change.
  const coinPrice = coin?.market_data?.current_price?.usd || 0;
  const availableBalance = wallet?.balance || 0;
  
  // This is the key part for the "Sell" tab. 
  // It relies on the 'asset' prop being up-to-date.
  const availableQuantity = asset?.quantity || 0; 

  // --- Calculations ---
  // Safely calculate the estimated quantity to buy.
  const estimatedBuyQuantity = (amount && coinPrice > 0) ? (parseFloat(amount) / coinPrice) : 0;

  // Safely calculate the estimated value of the assets to sell.
  const estimatedSellValue = (amount && coinPrice > 0) ? (parseFloat(amount) * coinPrice) : 0;

  const handleSubmit = () => {
    // Ensure the amount is a valid number before proceeding
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return; 
    }
    
    const orderData = {
      coinId: coin.id,
      orderType: tradeType.toUpperCase(),
      // For BUY, we send the calculated quantity; for SELL, we send the amount entered by the user.
      quantity: tradeType === 'buy' ? estimatedBuyQuantity : numericAmount,
    };
    // The handleTrade function (from the parent component) is responsible for making the API call
    // and then re-fetching the user's wallet and asset balances.
    handleTrade(orderData);
  };

  // --- Button disabled logic ---
  const isBuyButtonDisabled = !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance;
  const isSellButtonDisabled = !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableQuantity;

  return (
    <Tabs.Root 
      defaultValue="buy" 
      value={tradeType} 
      onValueChange={setTradeType}
      className="p-5"
    >
      <Tabs.List className="flex bg-orange-100 dark:bg-gray-700 p-1 rounded-md mb-5">
        <Tabs.Trigger
          value="buy"
          className={`flex-1 py-2 text-center rounded-md transition-colors ${
            tradeType === 'buy' 
              ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400'
          }`}
        >
          Buy
        </Tabs.Trigger>
        <Tabs.Trigger
          value="sell"
          className={`flex-1 py-2 text-center rounded-md transition-colors ${
            tradeType === 'sell' 
              ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400'
          }`}
        >
          Sell
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="buy" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How much do you want to spend? (USD)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 border border-orange-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
          {parseFloat(amount) > availableBalance && (
            <p className="text-red-500 text-sm mt-2">Insufficient Wallet Balance</p>
          )}
        </div>

        <div className="bg-orange-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{coin.symbol?.toUpperCase()} {coin.name}</span>
            {/* Added optional chaining for safety */}
            <span>${coinPrice.toLocaleString()} | {coin.market_data?.price_change_percentage_24h?.toFixed(2)}%</span>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Available Cash</span>
            <span className="text-gray-900 dark:text-white">${availableBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-400">Estimated Quantity</span>
            <span className="text-gray-900 dark:text-white">{estimatedBuyQuantity.toFixed(6)} {coin.symbol?.toUpperCase()}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${
            !isBuyButtonDisabled
              ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-400/30 transform hover:scale-[1.02]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={isBuyButtonDisabled}
        >
          BUY {coin.symbol?.toUpperCase()}
        </button>
      </Tabs.Content>

      <Tabs.Content value="sell" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How much do you want to sell? ({coin.symbol?.toUpperCase()})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.000000"
            className="w-full p-3 border border-orange-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
            {parseFloat(amount) > availableQuantity && (
            <p className="text-red-500 text-sm mt-2">Insufficient Asset Quantity</p>
          )}
        </div>

        <div className="bg-orange-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{coin.symbol?.toUpperCase()} {coin.name}</span>
            <span>${coinPrice.toLocaleString()} | {coin.market_data?.price_change_percentage_24h?.toFixed(2)}%</span>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Available Quantity</span>
            <span className="text-gray-900 dark:text-white">{availableQuantity.toFixed(6)} {coin.symbol?.toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-400">Estimated Value</span>
            <span className="text-gray-900 dark:text-white">${estimatedSellValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${
            !isSellButtonDisabled
              ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-400/30 transform hover:scale-[1.02]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={isSellButtonDisabled}
        >
          SELL {coin.symbol?.toUpperCase()}
        </button>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default TradingForm;