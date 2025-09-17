package com.crypto.controller;

import com.crypto.Model.User;
import com.crypto.Model.Wallet;
import com.crypto.Model.WalletTransaction;
import com.crypto.Model.Withdrawal;
import com.crypto.domain.WalletTransactionType;
import com.crypto.service.TransactionService;
import com.crypto.service.UserService;
import com.crypto.service.WalletService;
import com.crypto.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WithdrawalController {
    @Autowired
    private WithdrawalService withdrawalService;
    @Autowired
    private WalletService walletService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    /*@Autowired
    private WalletTra*/

    @PostMapping("/api/withdrawal/{amount}")
    public ResponseEntity<?> withdrawlRequest(@PathVariable Long amount,@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        Wallet userWallet=walletService.getUserWallet(user);

        Withdrawal withdrawal=withdrawalService.requestWithdrawal(amount,user);
        walletService.addBalance(userWallet,-withdrawal.getAmount());

        WalletTransaction walletTransaction=transactionService.createTransaction(userWallet, WalletTransactionType.WALLET_TRANSFER,null,"Bank Account withdrawal",withdrawal.getAmount());

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }



    @PostMapping("/api/admin/withdrawal/{id}/proceed/{accept}")
    public ResponseEntity<?> proceedWithdrawal(@PathVariable Long id,
                                               @RequestParam boolean accept,
                                               @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        Withdrawal withdrawal=withdrawalService.procedWithdrawal(id,accept);
        Wallet userWallet=walletService.getUserWallet(user);
        if (!accept){
            walletService.addBalance(userWallet,withdrawal.getAmount());
        }
        return new ResponseEntity<>(withdrawal, HttpStatus.OK);

    }
    @GetMapping("/api/withdrawal")
    public ResponseEntity<?> getUserWithdrawalHistory(@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        List<Withdrawal> withdrawal=withdrawalService.getUserWithdrawalHistory(user);
        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }
    @GetMapping("/api/admin/withdrawal")
    public ResponseEntity<?> getAllWithdrawalRequest(@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        List<Withdrawal> withdrawalHistory=withdrawalService.getAllWithdrawalRequest();
        return new ResponseEntity<>(withdrawalHistory, HttpStatus.OK);
    }

}
