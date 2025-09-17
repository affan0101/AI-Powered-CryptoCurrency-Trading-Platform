package com.crypto.service;

import com.crypto.Model.User;
import com.crypto.Model.VerificationCode;
import com.crypto.domain.VerificationType;

public interface CreateVerificationCodeService {
    VerificationCode sendVerificationCode(User user, VerificationType verificationType);
    VerificationCode getVerificationCodeById(Long id) throws Exception;
    VerificationCode getVerificationCodeByUser(Long UserId);
    void   deleteVerificationCodeById(VerificationCode verificationCode);

}
