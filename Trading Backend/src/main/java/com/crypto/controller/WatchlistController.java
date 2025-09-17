package com.crypto.controller;

import com.crypto.Model.Coin;
import com.crypto.Model.User;
import com.crypto.Model.Watchlist;

import com.crypto.service.CoinService;
import com.crypto.service.UserService;
import com.crypto.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;


    @GetMapping("/user")
    public ResponseEntity<Watchlist> getUserWatchlist(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        // This now safely creates a watchlist on the first call if it doesn't exist.
        Watchlist watchlist = watchlistService.findUserWatchlist(user.getId());
        return ResponseEntity.ok(watchlist);
    }

    @GetMapping("/{watchlistId}")
    public ResponseEntity<Watchlist> getWatchlistById(@PathVariable Long watchlistId) throws Exception {
        Watchlist watchlist = watchlistService.findById(watchlistId);
        return ResponseEntity.ok(watchlist);
    }

    // MODIFIED: This endpoint now correctly returns the entire Watchlist object.
    @PatchMapping("/add/coin/{coinId}")
    public ResponseEntity<Watchlist> addItemToWatchlist(@RequestHeader("Authorization") String jwt,
                                                        @PathVariable String coinId) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Coin coin = coinService.findById(coinId);

        // The service now returns the updated Watchlist, not just the Coin.
        Watchlist updatedWatchlist = watchlistService.addItemtoWatchlist(coin, user);

        // Return the full, updated watchlist to the frontend.
        return ResponseEntity.ok(updatedWatchlist);
    }
}
