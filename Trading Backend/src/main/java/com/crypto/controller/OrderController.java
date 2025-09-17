package com.crypto.controller;

import com.crypto.Model.Coin;
import com.crypto.Model.Order;
import com.crypto.Model.User;
import com.crypto.Model.WalletTransaction;
import com.crypto.domain.OrderType;
import com.crypto.request.CreateOrderRequest;
import com.crypto.service.CoinService;
import com.crypto.service.OrderService;
import com.crypto.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;

   /* @Autowired
    private WalletTransactionService walletTransactionService;*/
    @PostMapping("/pay")
    public ResponseEntity<Order> payOrderPayment(
            @RequestHeader("Authorization") String jwt,
            @RequestBody CreateOrderRequest req) throws Exception {
           User user=userService.findUserProfileByJwt(jwt);
        Coin coin=coinService.findById(req.getCoinId());
        Order order=orderService.processOrder(coin, req.getQuantity(),req.getOrderType(),user);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable Long orderId) throws Exception {
    /*    if (jwtToken == null) {
            throw new Exception("token missing....");

        }*/
        User user =userService.findUserProfileByJwt(jwtToken);
        Order order =orderService.getOrderById(orderId);
        if(order.getUser().getId().equals(user.getId())){
            return ResponseEntity.ok(order);
        }else{
           throw new Exception("You don't have access");
        }
    }

    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrderForUser(@RequestHeader("Authorization") String jwt
    , @RequestParam(required = false)OrderType order_Type,@RequestParam(required = false) String asset_symbol) throws Exception {
        Long userID=userService.findUserProfileByJwt(jwt).getId();
        List<Order> userOrder=orderService.getAllOrderOFUser(userID,order_Type,asset_symbol);
        return ResponseEntity.ok(userOrder);
    }
}
