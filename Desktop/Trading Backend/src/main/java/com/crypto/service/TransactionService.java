package com.crypto.service;

import com.crypto.Model.Wallet;
import com.crypto.Model.WalletTransaction;
import com.crypto.domain.WalletTransactionType;

import java.util.List;

public interface TransactionService {
    WalletTransaction createTransaction(Wallet wallet, WalletTransactionType type,
                                        String transferId, String purpose, Long amount);

    List<WalletTransaction> getTransactionByWallet(Wallet wallet);
}