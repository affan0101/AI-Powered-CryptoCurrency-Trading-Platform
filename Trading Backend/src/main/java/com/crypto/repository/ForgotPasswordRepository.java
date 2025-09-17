package com.crypto.repository;

import com.crypto.Model.ForgotPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPasswordToken,String> {
  ForgotPasswordToken findByUserId(Long userId);
}
