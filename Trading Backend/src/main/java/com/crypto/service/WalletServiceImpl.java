package com.crypto.service;

import com.crypto.Model.Order;
import com.crypto.Model.User;
import com.crypto.Model.Wallet;
import com.crypto.domain.OrderType;
import com.crypto.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
@Service
public class WalletServiceImpl implements WalletService{
    @Autowired
    private WalletRepository walletRepository;

    @Override
    public Wallet getUserWallet(User user) {
        Wallet wallet= walletRepository.findByUserId(user.getId());
        if (wallet == null) {
            wallet=new Wallet();
            wallet.setUser(user);
            walletRepository.save(wallet);
        }
        return wallet;
    }

    @Override
    public Wallet addBalance(Wallet wallet, Long money) {
        BigDecimal balance=wallet.getBalance();
        BigDecimal neBalance=balance.add(BigDecimal.valueOf(money));
        wallet.setBalance(neBalance);
        return walletRepository.save(wallet);
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {
        Optional<Wallet> wallet=walletRepository.findById(id);
        if (wallet.isPresent()) {
            return wallet.get();
        }
        throw new Exception("Wallet Not Found");
    }

    @Override
    public Wallet walletToWalletTransfer(User sender, Wallet recieverWallet, Long amount) throws Exception {
        Wallet senderWallet=getUserWallet(sender);
        if (senderWallet.getBalance().compareTo(BigDecimal.valueOf(amount))<0) {
            throw new Exception("Insufficient balance");
        }
        BigDecimal senderBalance=senderWallet.getBalance().subtract(BigDecimal.valueOf(amount));
        senderWallet.setBalance(senderBalance);
        walletRepository.save(senderWallet);
        BigDecimal recieverBalance=recieverWallet.getBalance().add(BigDecimal.valueOf(amount));
        recieverWallet.setBalance(recieverBalance);
        walletRepository.save(recieverWallet);
        return senderWallet;
    }

    @Override
    public Wallet payOrderPayment(Order order, User user) throws Exception {
        Wallet wallet=getUserWallet(user);
        if (order.getOrderType().equals(OrderType.BUY)) {
              BigDecimal newBalance=wallet.getBalance().subtract(order.getPrice());
            if (newBalance.compareTo(order.getPrice())<0) {
                throw  new Exception("Insufficient Funds for this transaction");
            }
            wallet.setBalance(newBalance);
        }
        else {
            BigDecimal newBalance=wallet.getBalance().add(order.getPrice());
            wallet.setBalance(newBalance);

        }
        walletRepository.save(wallet);
        return wallet;
    }
}
