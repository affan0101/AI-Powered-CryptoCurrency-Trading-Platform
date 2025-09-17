package com.crypto.repository;

import com.crypto.Model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode ,Long> {
    public VerificationCode findByUserId(Long userId);
}
