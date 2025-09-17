// src/components/SearchCoin.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function SearchCoin({ searchResults, loading, onCoinSelect }) {
  const navigate = useNavigate();

  const handleRedirect = (coinId) => {
    navigate(`/market/${coinId}`);
    if (onCoinSelect) {
      onCoinSelect(); // This function will clear the search input in the Navbar
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-300">
        No results found.
      </div>
    );
  }

  return (
    <ul className="max-h-96 overflow-y-auto">
      {searchResults.map((item) => (
        <li
          key={item.id}
          onClick={() => handleRedirect(item.id)}
          className="flex items-center gap-3 p-3 hover:bg-orange-100/50 dark:hover:bg-orange-900/30 cursor-pointer transition-colors duration-200"
        >
          <img src={item.thumb} alt={item.name} className="w-6 h-6 rounded-full" />
          <div>
            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              {item.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item.symbol.toUpperCase()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SearchCoin;