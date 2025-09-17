package com.crypto.service;

import com.crypto.Model.TwoFactorOTP;
import com.crypto.Model.User;

public interface TwoFactorOtpService {
    TwoFactorOTP createTwoFactorOtp(User user,String otp,String jwt);
    TwoFactorOTP findByUser(Long userId);
    TwoFactorOTP findById(String id);
    boolean verifyTwoFactorOtp(TwoFactorOTP twoFactorOTP,String otp);
    void deleteTwoFactorOtp(TwoFactorOTP twoFactorOTP);
}
