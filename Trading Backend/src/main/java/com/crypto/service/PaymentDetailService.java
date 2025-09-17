package com.crypto.service;

import com.crypto.Model.PaymentDetails;
import com.crypto.Model.User;

public interface PaymentDetailService {

     public PaymentDetails addPaymentDetails(String accountNoumber,
                                             String accountHolderName,
                                             String ifsc,
                                             String bankName,
                                             User user);

    public PaymentDetails getUsersPaymentDetails(User user);

}
