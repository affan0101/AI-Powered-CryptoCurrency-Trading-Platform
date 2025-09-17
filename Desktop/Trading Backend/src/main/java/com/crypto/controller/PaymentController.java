package com.crypto.controller;

import com.crypto.Model.PaymentOrder;
import com.crypto.Model.User;
import com.crypto.domain.PaymentMethod;
import com.crypto.response.PaymentResponse;
import com.crypto.service.PaymentService;
import com.crypto.service.UserService;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping()
public class PaymentController {

    @Autowired
    private UserService userService;
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(@PathVariable PaymentMethod paymentMethod,
                                                          @PathVariable Long amount,
                                                          @RequestHeader("Authorization") String jwt) throws Exception, RazorpayException, StripeException {
        User user=userService.findUserProfileByJwt(jwt);
        PaymentResponse paymentResponse;
        PaymentOrder order = paymentService.createOrder(user,amount,paymentMethod);
        if (paymentMethod.equals(PaymentMethod.RAZORPAY)){
            paymentResponse=paymentService.createRazorpayPaymentLink(user,amount, order.getId());
        } else{
            paymentResponse=paymentService.createStripePaymentLink(user,amount, order.getId());
        }

        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }

}
