package com.crypto.service;

import com.crypto.Model.User;
import com.crypto.Model.VerificationCode;
import com.crypto.utils.OtpUtils;
import com.crypto.domain.VerificationType;
import com.crypto.repository.VerificationCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CreateVerificationCodeServiceImpl implements CreateVerificationCodeService{

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;


    @Override
    public VerificationCode sendVerificationCode(User user, VerificationType verificationType) {
        VerificationCode verificationCode1=new VerificationCode();
        verificationCode1.setOtp(OtpUtils.generateOtp());
        verificationCode1.setVerificationType(verificationType);
        verificationCode1.setUser(user);
        return verificationCodeRepository.save(verificationCode1);
    }

    @Override
    public VerificationCode getVerificationCodeById(Long id) throws Exception {
        Optional<VerificationCode> verificationCode=verificationCodeRepository.findById(id);
        if (verificationCode.isPresent()) {
            return verificationCode.get();

        }
        throw new Exception("Verification code not Found");
    }

    @Override
    public VerificationCode getVerificationCodeByUser(Long UserId) {
        return verificationCodeRepository.findByUserId(UserId);
    }

    @Override
    public void deleteVerificationCodeById(VerificationCode verificationCode) {
        verificationCodeRepository.delete(verificationCode);
    }
}
