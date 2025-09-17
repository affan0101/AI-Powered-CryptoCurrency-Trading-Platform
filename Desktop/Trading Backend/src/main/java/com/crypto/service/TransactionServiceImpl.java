package com.crypto.service;

import com.crypto.Model.Wallet;
import com.crypto.Model.WalletTransaction;
import com.crypto.domain.WalletTransactionType;
import com.crypto.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;

@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private static final Logger logger = Logger.getLogger(TransactionServiceImpl.class.getName());

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public WalletTransaction createTransaction(Wallet wallet, WalletTransactionType type,
                                               String transferId, String purpose, Long amount) {
        try {
            WalletTransaction transaction = new WalletTransaction();
            transaction.setWallet(wallet);
            transaction.setType(type);
            transaction.setTransferId(transferId);
            transaction.setPurpose(purpose);
            transaction.setAmount(amount);
            transaction.setDate(LocalDate.now());
            transaction.setCreatedAt(LocalDateTime.now());

            WalletTransaction savedTransaction = transactionRepository.save(transaction);
            logger.info("Created transaction: " + savedTransaction.getId() + " for wallet: " + wallet.getId());
            return savedTransaction;
        } catch (Exception e) {
            logger.severe("Error creating transaction: " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<WalletTransaction> getTransactionByWallet(Wallet wallet) {
        try {
            List<WalletTransaction> transactions = transactionRepository.findByWalletOrderByDateDesc(wallet);
            logger.info("Found " + transactions.size() + " transactions for wallet: " + wallet.getId());
            return transactions;
        } catch (Exception e) {
            logger.severe("Error fetching transactions: " + e.getMessage());
            throw e;
        }
    }
}