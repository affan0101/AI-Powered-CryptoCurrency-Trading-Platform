export const existInWatchlist = (watchlistItems, coin) => {
  return watchlistItems.some(item => item.id === coin.id);
};