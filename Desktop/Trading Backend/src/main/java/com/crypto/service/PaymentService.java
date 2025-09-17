package com.crypto.service;

import com.crypto.Model.PaymentOrder;
import com.crypto.Model.User;
import com.crypto.domain.PaymentMethod;
import com.crypto.response.PaymentResponse;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;

public interface PaymentService {
    PaymentOrder createOrder(User user , Long amount, PaymentMethod paymentMethod);
    PaymentOrder getPaymentOrderById(Long id) throws Exception;
    boolean ProccedPaymentOrder(PaymentOrder paymentOrder,String paymentId) throws RazorpayException;
    PaymentResponse createRazorpayPaymentLink(User user, Long amount,Long orderId) throws RazorpayException;
    PaymentResponse createStripePaymentLink(User user, Long amount,Long orderId) throws StripeException;
}
