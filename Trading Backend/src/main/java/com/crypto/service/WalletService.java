package com.crypto.service;

import com.crypto.Model.Order;
import com.crypto.Model.User;
import com.crypto.Model.Wallet;

public interface WalletService {
     Wallet getUserWallet(User user);
     Wallet addBalance(Wallet wallet , Long money);
     Wallet findWalletById(Long id) throws Exception;
     Wallet walletToWalletTransfer(User sender, Wallet recieverWallet,Long amount) throws Exception;
     Wallet payOrderPayment(Order order , User user) throws Exception;

}
