package com.crypto.controller;

import com.crypto.Model.*;
import com.crypto.repository.WalletRepository;
import com.crypto.response.PaymentResponse;
import com.crypto.service.OrderService;
import com.crypto.service.PaymentService;
import com.crypto.service.UserService;
import com.crypto.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
public class WalletController {
    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/api/wallet")
    public ResponseEntity<Wallet> getUserWallet(@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        Wallet wallet=walletService.getUserWallet(user);

        return  new ResponseEntity<>(wallet, HttpStatus.ACCEPTED);
    }


    @PutMapping("/api/wallet/{walletId}/transfer")
    public ResponseEntity<Wallet> walletToWalletTransfer(@RequestHeader("Authorization") String jwt, @PathVariable Long walletId,
                                                         @RequestBody WalletTransaction req) throws Exception {
        User senderUser=userService.findUserProfileByJwt(jwt);
        Wallet senderWallet=walletService.getUserWallet(senderUser);
        Wallet recieverWallet=walletService.findWalletById(walletId);
        Wallet wallet=walletService.walletToWalletTransfer(senderUser,recieverWallet, req.getAmount());

        return new ResponseEntity<>(wallet,HttpStatus.ACCEPTED);

    }


    @PutMapping("/api/wallet/order/{orderId}/pay")
    public ResponseEntity<Wallet> payOrderPayment(@RequestHeader("Authorization") String jwt, @PathVariable Long orderId) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        Order order=orderService.getOrderById(orderId);
        Wallet wallet=walletService.payOrderPayment(order,user);


        return new ResponseEntity<>(wallet,HttpStatus.ACCEPTED);

    }

    @PutMapping("/api/wallet/deposite")
    public ResponseEntity<Wallet> addBalanceToWallet(@RequestHeader("Authorization") String jwt,
                                                   @RequestParam(name="order_id") Long orderId,
                                                   @RequestParam(name="payment_id") String paymentId
                                                   ) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);

        Wallet wallet=walletService.getUserWallet(user);
        PaymentOrder order=paymentService.getPaymentOrderById(orderId);
        Boolean status=paymentService.ProccedPaymentOrder(order,paymentId);
        if (wallet.getBalance()==null) {
            wallet.setBalance(BigDecimal.valueOf(0));
        }

        if (status){
            wallet=walletService.addBalance(wallet,order.getAmount());
        }
        return new ResponseEntity<>(wallet,HttpStatus.ACCEPTED);

    }



}
