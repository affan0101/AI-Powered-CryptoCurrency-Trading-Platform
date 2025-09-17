package com.crypto.service;

import com.crypto.Model.Coin;
import com.crypto.Model.User;
import com.crypto.Model.Watchlist;
import com.crypto.repository.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WatchlistServiceImpl implements WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepository;

    // ADDED: Inject the UserService to fetch the User object when needed.
    // This is necessary for creating a watchlist for a new user.
    @Autowired
    private UserService userService;

    @Override
    public Watchlist findUserWatchlist(Long userId) throws Exception {
        Watchlist watchlist = watchlistRepository.findByUserId(userId);

        // MODIFIED: Create-on-demand logic
        // If the watchlist is null (for a new user), create it instead of throwing an error.
        if (watchlist == null) {
            User user = userService.findUserById(userId);
            return createWatchlist(user);
        }
        return watchlist;
    }

    @Override
    public Watchlist createWatchlist(User user) {
        Watchlist newWatchlist = new Watchlist();
        newWatchlist.setUser(user);
        // Save the newly created watchlist and return it.
        return watchlistRepository.save(newWatchlist);
    }

    @Override
    public Watchlist findById(Long id) throws Exception {
        Optional<Watchlist> watchlistOptional = watchlistRepository.findById(id);
        if (watchlistOptional.isEmpty()) {
            throw new Exception("Watchlist not found with ID: " + id);
        }
        return watchlistOptional.get();
    }

    @Override
    public Watchlist addItemtoWatchlist(Coin coin, User user) throws Exception {
        Watchlist watchlist = findUserWatchlist(user.getId());

        if (watchlist.getCoins().contains(coin)) {
            // If the coin is already present, remove it.
            watchlist.getCoins().remove(coin);
        } else {
            // Otherwise, add it.
            watchlist.getCoins().add(coin);
        }

        // Save and return the entire updated watchlist object.
        return watchlistRepository.save(watchlist);
    }
}

