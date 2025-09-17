package com.crypto.repository;

import com.crypto.Model.Wallet;
import com.crypto.Model.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<WalletTransaction,Long> {
    List<WalletTransaction> findByWallet(Wallet wallet);
    List<WalletTransaction> findByWalletOrderByDateDesc(Wallet wallet);

}
