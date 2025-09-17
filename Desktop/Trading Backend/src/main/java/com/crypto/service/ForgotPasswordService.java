package com.crypto.service;

import com.crypto.Model.ForgotPasswordToken;
import com.crypto.Model.User;
import com.crypto.domain.VerificationType;

public interface ForgotPasswordService {
    ForgotPasswordToken createToken(User user , String id,String otp,
                                    VerificationType verificationType,
                                    String sendTo);
    ForgotPasswordToken findById(String id);
    ForgotPasswordToken findByUser(Long userId);
    void deleteToken(ForgotPasswordToken token);

}
