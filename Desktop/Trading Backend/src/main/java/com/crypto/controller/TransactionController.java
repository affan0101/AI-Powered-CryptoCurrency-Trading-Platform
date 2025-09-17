package com.crypto.controller;

import com.crypto.Model.User;
import com.crypto.Model.Wallet;
import com.crypto.Model.WalletTransaction;
import com.crypto.service.TransactionService;
import com.crypto.service.UserService;
import com.crypto.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping
public class TransactionController {

    private static final Logger logger = Logger.getLogger(TransactionController.class.getName());

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("api/wallet/transactions")
    public ResponseEntity<List<WalletTransaction>> getUserWallet(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            logger.info("Fetching transactions for user: " + user.getId());

            Wallet wallet = walletService.getUserWallet(user);
            logger.info("Found wallet: " + wallet.getId());

            List<WalletTransaction> transactionsList = transactionService.getTransactionByWallet(wallet);
            logger.info("Retrieved " + transactionsList.size() + " transactions");

            return new ResponseEntity<>(transactionsList, HttpStatus.ACCEPTED);
        } catch (Exception e) {
            logger.severe("Error fetching transactions: " + e.getMessage());
            throw e;
        }
    }
}