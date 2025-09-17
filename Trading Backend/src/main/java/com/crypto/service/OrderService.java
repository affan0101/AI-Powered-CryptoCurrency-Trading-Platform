package com.crypto.service;

import com.crypto.Model.Coin;
import com.crypto.Model.Order;
import com.crypto.Model.OrderItem;
import com.crypto.Model.User;
import com.crypto.domain.OrderType;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface OrderService {
    
    Order createOrder(User user, OrderItem orderItem, OrderType orderType);
    Order getOrderById(Long orderId) throws Exception;
    List<Order> getAllOrderOFUser(Long userId,OrderType orderType, String assetSymbol);
    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;


}
