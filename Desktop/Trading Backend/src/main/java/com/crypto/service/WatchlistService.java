package com.crypto.service;

import com.crypto.Model.Coin;
import com.crypto.Model.User;
import com.crypto.Model.Watchlist;

public interface WatchlistService {
    Watchlist findUserWatchlist(Long userId) throws Exception;
    Watchlist createWatchlist(User user);
    Watchlist findById(Long id) throws Exception;
    Watchlist addItemtoWatchlist(Coin coin, User user) throws Exception;

}
